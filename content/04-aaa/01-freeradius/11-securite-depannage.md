---
title: Sécurité, performances et dépannage
description: Durcissement de FreeRADIUS (BlastRADIUS / Message-Authenticator, secrets, droits, journaux), réglages de performance (threads, pools, cache), journalisation, radmin et raddebug, lecture de radiusd -X et tableau des erreurs fréquentes.
tags: [freeradius, sécurité, blastradius, performance, dépannage, debug, radmin]
icon: bug
---

## BlastRADIUS (CVE-2024-3596)

Une attaque par collision MD5 permet, à un attaquant **placé entre le NAS et le serveur**, de transformer un Access-Reject en Access-Accept lorsque les paquets ne contiennent pas d'attribut **Message-Authenticator**. Les méthodes PAP, CHAP, MS-CHAP (hors EAP) sont concernées ; EAP inclut toujours `Message-Authenticator`.

Mesures (FreeRADIUS **3.2.5+**) :

```radius clients.conf
client switches-acces {
    ipaddr = 10.0.1.0/24
    secret = "…"
    require_message_authenticator = yes    # rejeter les Access-Request sans Message-Authenticator
    limit_proxy_state = yes                # rejeter les paquets avec Proxy-State sans Message-Authenticator
}
```

```radius proxy.conf (home_server)
home_server partenaire1 {
    ...
    require_message_authenticator = yes    # exiger l'attribut dans les réponses reçues
}
```

- Valeur `auto` (par défaut en 3.2.5+) : apprend automatiquement si le client envoie l'attribut et l'exige ensuite.
- Mettre à jour aussi les **NAS** (firmwares corrigés envoient `Message-Authenticator` dans tous les paquets).
- À terme : **RadSec** (TLS) pour les liaisons non maîtrisées.

## Durcissement

| Mesure | Détail |
| --- | --- |
| Secrets | Longs, aléatoires, un par famille de NAS, jamais `testing123` hors du poste local |
| `clients.conf` | Réseaux précis (pas de `0.0.0.0/0`), droits `640 root:freerad` |
| Pare-feu | 1812/1813 uniquement depuis les NAS ; 3799 vers les NAS ; 18121 (status) local |
| Comptes de service | LDAP/SQL en lecture seule, mots de passe dans des fichiers protégés |
| Certificats EAP | Clé privée `640`, AC dédiée, surveillance de l'expiration |
| Journaux | Ne **pas** journaliser les mots de passe (`auth_badpass = no`, `auth_goodpass = no`) |
| Attributs de réponse | `attr_filter` pour ne pas renvoyer d'attributs internes vers des proxys |
| Mises à jour | Suivre les annonces de sécurité (freeradius.org/security) |
| Mode debug | Ne jamais laisser tourner `radiusd -X` en production (affiche les secrets et mots de passe) |

```radius radiusd.conf (section log)
log {
    destination = files
    file = ${logdir}/radius.log
    syslog_facility = daemon
    stripped_names = no
    auth = yes                 # journaliser chaque Access-Accept / Reject
    auth_badpass = no
    auth_goodpass = no
    msg_denied = "Vous êtes déjà connecté"
}
```

### Délai sur les refus

```radius radiusd.conf
security {
    max_attributes = 200
    reject_delay = 1          # retarde les Access-Reject : freine le brute force
    status_server = yes
    allow_core_dumps = no
}
```

## Performances

| Réglage (`radiusd.conf`) | Défaut | Conseil |
| --- | --- | --- |
| `thread pool { start_servers }` | 5 | 10-32 selon la charge |
| `max_servers` | 32 | 64-256 si latences backend (LDAP/AD) |
| `max_requests` | 16384 | `max_servers` × 256 environ |
| `max_request_time` | 30 | 30 (au-delà, la requête est abandonnée) |
| `cleanup_delay` | 5 | 5 (réponses en cache pour les retransmissions) |

- **Le backend est presque toujours le goulot** : pools de connexions LDAP/SQL suffisants, `ntlm_auth` → `winbind_username`, index SQL.
- Module **`cache`** pour mémoriser les recherches LDAP (groupes) quelques minutes :

```radius mods-available/cache (instance)
cache cache_ldap_groupes {
    driver = "rlm_cache_rbtree"
    key = "%{Stripped-User-Name}"
    ttl = 300
    update {
        &control:LDAP-UserDn := &control:LDAP-UserDn
        &control:Tmp-String-0 := &control:Tmp-String-0
    }
}
```

- Cache de session TLS (`cache { enable = yes }` dans `eap`) : divise par 3-4 la charge des réauthentifications Wi-Fi.
- Mesurer : `radperf` (NetworkRADIUS) ou `radclient -c 1000 -p 50` (1000 envois, 50 en parallèle).

## Outils de diagnostic

### radiusd -X : lire la sortie

```text
(5) Received Access-Request Id 42 from 10.0.1.21:1645 to 10.0.10.31:1812 length 245
(5)   User-Name = "alice"
(5)   Calling-Station-Id = "3C-52-82-AA-BB-CC"
(5)   EAP-Message = 0x02…
(5) # Executing section authorize from file /etc/freeradius/3.0/sites-enabled/default
(5)   authorize {
(5)     policy filter_username {
(5)       if (&User-Name) {
(5)       if (&User-Name)  -> TRUE
...
(5)     [eap] = ok
(5)   } # authorize = ok
(5) Found Auth-Type = eap
(5) # Executing group from file /etc/freeradius/3.0/sites-enabled/default
(5)   authenticate {
(5) eap: Peer sent packet with method EAP PEAP (25)
(5) eap_peap: Session established.  Decoding tunneled attributes
(5) Virtual server inner-tunnel received request
(5)     mschap: Executing: /usr/bin/ntlm_auth … :
(5)     mschap: ERROR: Program returned code (1) and output 'Logon failure (0xc000006d)'
(5)     [mschap] = reject
(5) Sent Access-Reject Id 47 from 10.0.10.31:1812 to 10.0.1.21:1645 length 44
```

- Le numéro entre parenthèses `(5)` identifie la requête : suivez-le.
- Cherchez `ERROR`, `WARNING`, `-> FALSE`, `= reject`, `= fail`, `notfound`.
- Les lignes `inner-tunnel` montrent ce qui se passe dans PEAP/TTLS.

### Debug ciblé en production : raddebug / radmin

```radius sites-enabled/control-socket
listen {
    type = control
    socket = ${run_dir}/${name}.sock
    mode = rw
}
```

```bash
sudo ln -s ../sites-available/control-socket /etc/freeradius/3.0/sites-enabled/
sudo raddebug -t 60 -u alice                 # debug complet uniquement pour l'utilisateur alice pendant 60 s
sudo raddebug -t 60 -i 10.0.1.21             # uniquement pour un NAS
sudo radmin -e "show home_server list"       # état des serveurs de proxy
sudo radmin -e "stats client auth 10.0.1.21" # statistiques par client
sudo radmin -e "hup"                         # rechargement partiel
```

### Capture réseau

```bash
sudo tcpdump -ni any -s0 -w radius.pcap 'udp port 1812 or udp port 1813 or udp port 3799'
# Wireshark : Préférences → Protocols → RADIUS → Shared Secret pour décoder User-Password
```

## Erreurs fréquentes

| Message / symptôme | Cause | Solution |
| --- | --- | --- |
| `Ignoring request to auth address * port 1812 … from unknown client 10.0.1.25` | NAS non déclaré, ou IP source différente (interface de sortie) | Ajouter le client ou fixer `ip radius source-interface` sur le NAS |
| `Dropping packet without response because of error: Received packet from 10.0.1.21 with invalid Message-Authenticator! (Shared secret is incorrect.)` | Secret différent | Ressaisir le secret des deux côtés (attention aux caractères spéciaux) |
| `No Auth-Type found: rejecting the user via Post-Auth-Type = Reject` | Aucun module n'a trouvé l'utilisateur ni de méthode | Utilisateur absent, module non appelé dans `authorize` |
| `pap: WARNING: No "known good" password found for the user` | Aucun mot de passe de référence (ni `Cleartext-Password`, ni LDAP bind) | Vérifier la source (files/sql/ldap) et l'ordre |
| `mschap: FAILED: No NT-Password. Cannot perform authentication` | Source sans hash NT (LDAP) pour MS-CHAP | Utiliser `ntlm_auth`, ou EAP-TTLS/PAP |
| `Logon failure (0xc000006d)` | Mauvais mot de passe AD | — |
| `Account locked out (0xc0000234)` / `Password expired (0xc0000071)` | Compte AD | Déverrouiller / changer le mot de passe |
| `eap: ERROR: rlm_eap (EAP): No EAP session matching state` | Paquets d'une même session EAP arrivés sur des serveurs différents, ou timeout | Affinité sur le répartiteur, `timer_expire` |
| `TLS Alert read:fatal:unknown CA` | Le client refuse le certificat serveur | Déployer l'AC sur les postes |
| `Login incorrect (Failed retrieving values required to evaluate condition)` | Attribut absent dans une condition | Tester l'existence (`if (&Attr && …)`) |
| `Unknown attribute 'Xxx'` au démarrage | Dictionnaire manquant ou faute de frappe | Inclure le dictionnaire constructeur |
| `Failed binding to auth address … Address already in use` | Une autre instance (ou `radiusd -X`) tourne déjà | `systemctl stop freeradius` / `ss -lunp` |
| `rlm_sql (sql): Failed to connect` / `rlm_ldap: Bind … failed` | Backend injoignable, identifiants, certificat LDAPS | Tester avec `mysql` / `ldapsearch` depuis le serveur |
| Délai puis Access-Reject systématique | `reject_delay`, ou backend lent (`max_request_time`) | Mesurer le temps des modules dans `-X` |

## Supervision

- Processus et ports 1812/1813 ; test d'authentification réel avec un **compte de sonde** dédié (Centreon : plugin `apps::protocols::radius::plugin`, mode `login`).
- Statistiques via Status-Server (`apps::freeradius::plugin`).
- Taux de rejets dans `radius.log` / `radpostauth` (alerte en cas de pic : panne AD, certificat expiré, attaque).
- **Expiration du certificat EAP** : alerte 60 jours avant (un certificat expiré coupe tout le Wi-Fi d'entreprise).

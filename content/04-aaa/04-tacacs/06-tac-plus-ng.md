---
title: Serveur tac_plus-ng
description: Installer et configurer tac_plus-ng (event-driven-servers) — compilation, service systemd, structure spawnd / tac_plus-ng, équipements et clés, utilisateurs et mots de passe, groupes, profils scriptés (Cisco, NX-OS, Junos, FortiGate), règles, autorisation commande par commande, journaux, liaison à Active Directory via MAVIS LDAP et haute disponibilité.
tags: [tacacs+, tac_plus-ng, serveur, linux, active directory, ldap, mavis, configuration]
icon: server-cog
---

**tac_plus-ng** est le serveur TACACS+ libre maintenu par Marc Huber dans le projet *event-driven-servers*. Il succède à son tac_plus, lui-même dérivé du serveur Cisco. Il gère des milliers d'équipements, des règles scriptées, plusieurs sources d'utilisateurs (fichier, LDAP/AD, RADIUS, PAM) et TACACS+ sur TLS.

> [!NOTE]
> La syntaxe ci-dessous suit la documentation des versions récentes. Elle évolue parfois : la référence est la page `tac_plus-ng.html` fournie dans les sources, et `tac_plus-ng -P` vérifie toujours la configuration avant un redémarrage.

## Installation

tac_plus-ng n'est pas empaqueté par la plupart des distributions : on le compile.

```bash
# Debian / Ubuntu
sudo apt install build-essential git libpcre2-dev libssl-dev \
  libnet-ldap-perl libio-socket-ssl-perl libdigest-md4-perl
# RHEL / Rocky / Alma : dnf groupinstall "Development Tools" && dnf install git pcre2-devel openssl-devel perl-LDAP perl-IO-Socket-SSL

git clone https://github.com/MarcJHuber/event-driven-servers.git
cd event-driven-servers
./configure --prefix=/usr/local tac_plus-ng   # ne compile que tac_plus-ng et ses dépendances (spawnd, mavis)
make
sudo make install
```

Fichiers installés :

| Chemin | Rôle |
| --- | --- |
| `/usr/local/sbin/tac_plus-ng` | Le serveur |
| `/usr/local/etc/tac_plus-ng.cfg` | Configuration (à créer) |
| `/usr/local/lib/mavis/` | Modules MAVIS (LDAP, AD, RADIUS…) |
| `/usr/local/share/tac_plus-ng/` ou les sources | Documentation HTML et exemples |

### Service systemd

```systemd /etc/systemd/system/tac_plus-ng.service
[Unit]
Description=Serveur TACACS+ tac_plus-ng
After=network-online.target
Wants=network-online.target

[Service]
ExecStartPre=/usr/local/sbin/tac_plus-ng -P /usr/local/etc/tac_plus-ng.cfg
ExecStart=/usr/local/sbin/tac_plus-ng /usr/local/etc/tac_plus-ng.cfg
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo mkdir -p /var/log/tac_plus-ng
sudo systemctl daemon-reload
sudo systemctl enable --now tac_plus-ng
sudo ss -tlnp | grep ':49 '
```

> [!IMPORTANT]
> Avec systemd, mettez `background = no` dans le bloc `spawnd` : c'est systemd qui gère le processus. Le rechargement (`systemctl reload`) relit la configuration sans couper les sessions.

## Structure de la configuration

```tacplus /usr/local/etc/tac_plus-ng.cfg
#!/usr/local/sbin/tac_plus-ng

id = spawnd {                        # processus d'écoute et de répartition
    listen = { port = 49 }
    spawn = {
        instances min = 1
        instances max = 16
    }
    background = no
}

id = tac_plus-ng {                   # le serveur TACACS+ proprement dit
    # 1. journaux
    # 2. sources d'utilisateurs (fichier, MAVIS)
    # 3. équipements (device) et clés
    # 4. profils (ce qu'on accorde)
    # 5. groupes et utilisateurs
    # 6. règles (qui reçoit quel profil)
}
```

Le serveur évalue une requête ainsi : il identifie l'**équipement** par son adresse (et vérifie la clé), authentifie l'**utilisateur**, parcourt le **ruleset** pour trouver le **profil** qui s'applique, puis exécute le **script** du profil pour décider et renvoyer les attributs.

## Exemple complet

```tacplus /usr/local/etc/tac_plus-ng.cfg
#!/usr/local/sbin/tac_plus-ng

id = spawnd {
    listen = { port = 49 }
    spawn = { instances min = 1 instances max = 16 }
    background = no
}

id = tac_plus-ng {
    # --- Journaux : un fichier par jour et par type ---
    log authclog { destination = /var/log/tac_plus-ng/authc-%Y%m%d.log }
    log authzlog { destination = /var/log/tac_plus-ng/authz-%Y%m%d.log }
    log acctlog  { destination = /var/log/tac_plus-ng/acct-%Y%m%d.log }
    authentication log = authclog
    authorization log  = authzlog
    accounting log     = acctlog

    # --- Équipements : adresse source et clé partagée ---
    device reseau-campus {
        address = 10.0.10.0/24
        address = 10.0.11.0/24
        key = "Cle-Campus-Longue-Et-Aleatoire-42"
        welcome banner = "Acces reserve aux administrateurs autorises\n"
    }
    device datacenter {
        address = 10.20.0.0/22
        key = "Cle-Datacenter-Differente-Et-Longue-77"
    }

    # --- Profils : ce qui est accordé ---
    profile admin {
        script {
            if (service == shell) {
                if (cmd == "") {             # ouverture du shell
                    set priv-lvl = 15
                    permit
                }
                permit                       # toutes les commandes
            }
            if (service == junos-exec) {     # Juniper
                set local-user-name = super
                permit
            }
        }
    }

    profile lecture {
        script {
            if (service == shell) {
                if (cmd == "") {
                    set priv-lvl = 1
                    permit
                }
                if (cmd =~ /^show /) permit
                if (cmd =~ /^(ping|traceroute) /) permit
                if (cmd =~ /^(exit|logout|terminal length) /) permit
                deny
            }
            if (service == junos-exec) {
                set local-user-name = read-only
                permit
            }
        }
    }

    profile noc {
        script {
            if (service == shell) {
                if (cmd == "") { set priv-lvl = 15 permit }
                if (cmd =~ /^(reload|write erase|erase|format|delete) /) deny
                if (cmd =~ /^(crypto key zeroize|no aaa|aaa) /) deny
                permit
            }
        }
    }

    # --- Groupes et utilisateurs locaux ---
    group admins
    group noc
    group lecture

    user alice {
        password login  = crypt $6$Sel.Exemple$HachageGenereParOpensslPasswd6...
        password enable = crypt $6$Sel.Exemple$AutreHachage...
        member = admins
    }
    user bob {
        password login = crypt $6$Sel.Exemple$HachageDeBob...
        member = lecture
    }

    # --- Règles : qui reçoit quel profil ---
    ruleset {
        rule admins   { script { if (member == admins)  { profile = admin   permit } } }
        rule noc      { script { if (member == noc)     { profile = noc     permit } } }
        rule lecture  { script { if (member == lecture) { profile = lecture permit } } }
    }
}
```

Générer un hachage de mot de passe :

```bash
openssl passwd -6        # SHA-512 crypt, à coller après "crypt"
```

## Concepts

### Équipements (`device`)

| Directive | Rôle |
| --- | --- |
| `address = 10.0.10.0/24` | Adresses ou réseaux source autorisés (plusieurs lignes possibles, IPv4 et IPv6) |
| `key = "…"` | Clé partagée ; plusieurs `key` sont acceptées pendant un changement de clé |
| `welcome banner`, `reject banner`, `motd banner` | Messages affichés à la connexion |
| `device <nom> { … }` imbriqué | Sous-groupe qui hérite de la clé et des réglages du parent |

> [!TIP]
> Une **clé par groupe d'équipements** (campus, datacenter, sites distants) limite l'impact d'une fuite. Pendant une rotation, déclarez l'ancienne et la nouvelle clé, changez les équipements, puis retirez l'ancienne.

### Profils et scripts

Un profil contient un **script** évalué à chaque requête d'autorisation. Les tests portent sur les attributs de la requête :

| Variable | Contenu |
| --- | --- |
| `service` | `shell`, `junos-exec`, `ppp`, `fortigate`… |
| `cmd` | Commande complète avec ses arguments ; vide (`""`) à l'ouverture du shell |
| `member` | Groupes de l'utilisateur |
| `user` | Nom d'utilisateur |
| `device`, `device.address` | Équipement à l'origine de la requête |
| `nac` / `client.address` | Adresse de l'administrateur (selon la version) |
| `priv-lvl` | Niveau demandé |

Opérateurs : `==`, `!=`, `=~` (expression régulière PCRE), `!~`, combinables avec `&&`, `||`, `!`. Actions : `permit`, `deny`, `set <attribut> = <valeur>`, `return`.

### Attributs selon les constructeurs

```tacplus
profile admin-multi {
    script {
        if (service == shell) {
            if (cmd == "") {
                set priv-lvl = 15                              # Cisco IOS / IOS XE, Arista, Aruba
                set shell:roles = "\"network-admin\""          # Cisco NX-OS
                permit
            }
            permit
        }
        if (service == junos-exec) {                           # Juniper
            set local-user-name = super
            permit
        }
        if (service == fortigate) {                            # FortiGate
            set admin_prof = super_admin
            permit
        }
        if (service == PaloAlto) {                             # Palo Alto
            set PaloAlto-Admin-Role = superuser
            permit
        }
    }
}
```

> [!NOTE]
> Les attributs inconnus d'un équipement doivent être **facultatifs** pour ne pas faire échouer l'autorisation. tac_plus-ng envoie les attributs `set` comme obligatoires ; quand un même profil sert plusieurs constructeurs, séparez les cas par `service` ou par groupe d'équipements.

### Utilisateurs

| Directive | Rôle |
| --- | --- |
| `password login = clear …` / `crypt …` / `mavis` | Mot de passe de connexion |
| `password enable = …` | Mot de passe du mode privilégié |
| `password pap = …` | Mot de passe PAP si différent |
| `member = groupe` | Appartenance (répétable) |
| `valid until = 2026-12-31` | Date d'expiration du compte |

## Liaison à Active Directory (MAVIS LDAP)

Les comptes personnels de l'AD évitent de gérer des mots de passe dans le fichier. Le module externe `mavis_tacplus_ldap.pl` interroge l'annuaire et transmet les **groupes AD** à tac_plus-ng.

```tacplus
id = tac_plus-ng {
    mavis module = external {
        setenv LDAP_SERVER_TYPE = "microsoft"
        setenv LDAP_HOSTS = "ldaps://dc1.exemple.lan:636 ldaps://dc2.exemple.lan:636"
        setenv LDAP_BASE = "DC=exemple,DC=lan"
        setenv LDAP_USER = "svc-tacacs@exemple.lan"
        setenv LDAP_PASSWD = "Mot-De-Passe-Du-Compte-De-Service"
        setenv TACACS_GROUP_PREFIX = "tacacs-"        # seuls les groupes AD commençant ainsi sont pris en compte
        setenv REQUIRE_TACACS_GROUP_PREFIX = 1        # refuser les utilisateurs sans groupe tacacs-*
        exec = /usr/local/lib/mavis/mavis_tacplus_ldap.pl
    }

    login backend = mavis
    user backend  = mavis
    pap backend   = mavis

    # Groupes correspondant aux groupes AD (préfixe retiré ou conservé selon la version : vérifier en débogage)
    group admins
    group noc
    group lecture

    # … device, profile, ruleset comme plus haut
}
```

Côté AD :

1. Créer un **compte de service** en lecture seule (`svc-tacacs`), mot de passe long, sans droit d'ouverture de session interactive.
2. Créer les groupes `tacacs-admins`, `tacacs-noc`, `tacacs-lecture` et y placer les administrateurs.
3. Vérifier que le serveur fait confiance au certificat LDAPS des contrôleurs de domaine (AC interne dans le magasin de certificats du système).

> [!WARNING]
> Les noms exacts des variables `setenv` et la façon dont le préfixe est traité peuvent varier selon la version du module : lisez l'en-tête de `mavis_tacplus_ldap.pl` installé et vérifiez en débogage quels groupes sont transmis pour un utilisateur de test.

Autres back-ends MAVIS disponibles : RADIUS (s'appuyer sur un serveur RADIUS et son MFA), PAM (comptes du système), système de fichiers, ou chaînage de plusieurs modules.

## Vérifier et déboguer

```bash
# Vérifier la syntaxe (indispensable avant tout redémarrage)
sudo /usr/local/sbin/tac_plus-ng -P /usr/local/etc/tac_plus-ng.cfg

# Débogage : ajouter temporairement dans le bloc tac_plus-ng
#   debug = PACKET AUTHEN AUTHOR MAVIS
# puis lancer au premier plan (background = no), service arrêté
sudo systemctl stop tac_plus-ng
sudo /usr/local/sbin/tac_plus-ng /usr/local/etc/tac_plus-ng.cfg
```

Retirez la ligne `debug` une fois le problème résolu : elle est très bavarde et écrit des informations sensibles. Les messages les plus utiles sont détaillés dans [[04-tacacs/12-securite-depannage|Sécurité et dépannage]].

Tester depuis un poste déclaré comme équipement :

```bash
tacacs_client -H 10.0.1.10 -k 'Cle-Campus-Longue-Et-Aleatoire-42' -u alice authenticate
tacacs_client -H 10.0.1.10 -k 'Cle-Campus-Longue-Et-Aleatoire-42' -u bob authorize -c service=shell cmd=show cmdargs=version
```

## Haute disponibilité

- **Deux serveurs** (ou plus) avec la même configuration, déployée par Ansible depuis un dépôt Git ; `tac_plus-ng -P` dans le pipeline avant tout déploiement.
- Les équipements interrogent les serveurs dans l'ordre configuré ; un serveur arrêté est détecté immédiatement (connexion TCP refusée), un serveur injoignable après le délai d'attente.
- Le serveur ne garde **aucun état partagé** : pas de base à répliquer, seulement les journaux à centraliser (voir [[04-tacacs/11-journalisation|Journalisation]]).

## Pare-feu du serveur

```bash
# nftables : n'accepter TACACS+ que depuis les réseaux de gestion
sudo nft add rule inet filter input ip saddr { 10.0.10.0/23, 10.20.0.0/22 } tcp dport { 49, 300 } accept
sudo nft add rule inet filter input tcp dport { 49, 300 } drop
```

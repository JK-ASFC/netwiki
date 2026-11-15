---
title: Kerberos (MIT) — aide-mémoire des commandes
description: Référence complète des commandes Kerberos MIT avec exemples — installation (Debian/Ubuntu, RHEL, Alpine, clients macOS et Windows), fichiers krb5.conf, kdc.conf et kadm5.acl, enregistrements DNS SRV, pare-feu, création du royaume et clé maîtresse (kdb5_util create, stash, rotation), administration kadmin et kadmin.local (principaux, options, expiration, pré-authentification, renommage, politiques, droits, clés aléatoires, purge des anciennes clés), keytabs (ktadd, ktremove, ktutil, k5srvutil, keytab d'un compte Active Directory), tickets côté client (kinit, klist, kswitch, kvno, kpasswd, caches), SSH avec GSSAPI, propagation vers les KDC secondaires (kprop, kpropd, iprop), sauvegarde, traces KRB5_TRACE, équivalents Windows (klist, setspn, ktpass, ksetup) et erreurs fréquentes.
tags: [aide-mémoire, kerberos, mit kerberos, kadmin, kinit, keytab, krb5, kprop, gssapi]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Kerberos]] et [[02-replication-depannage|réplication et dépannage]]. Exemples : royaume `EXEMPLE.FR`, KDC `kdc1.exemple.fr` (principal) et `kdc2.exemple.fr` (secondaire), serveur `srv-web01.exemple.fr`.

> [!TIP]
> `kadmin.local` s'exécute **sur le KDC principal** (root, accès direct à la base) ; `kadmin -p admin/admin` fonctionne depuis n'importe quel poste avec un principal autorisé dans `kadm5.acl`. Chaque commande s'utilise en interactif (`kadmin.local` puis `listprincs`) ou en une ligne (`kadmin.local -q "listprincs"`).

## Installation

```bash
# Debian / Ubuntu : KDC, serveur d'administration, outils clients
sudo apt install krb5-kdc krb5-admin-server krb5-user
# RHEL / Rocky / Alma / Fedora
sudo dnf install krb5-server krb5-workstation
# Alpine
sudo apk add krb5-server krb5
# Client seul
sudo apt install krb5-user                       # Debian / Ubuntu
sudo dnf install krb5-workstation                # RHEL
# macOS : kinit, klist, kdestroy intégrés (Heimdal) ; MIT via « brew install krb5 »
# Windows : klist intégré ; MIT Kerberos for Windows pour kinit
```

| Fichier | Debian / Ubuntu | RHEL |
| --- | --- | --- |
| Configuration client | `/etc/krb5.conf` | `/etc/krb5.conf` (+ `/etc/krb5.conf.d/`) |
| Configuration du KDC | `/etc/krb5kdc/kdc.conf` | `/var/kerberos/krb5kdc/kdc.conf` |
| Droits d'administration | `/etc/krb5kdc/kadm5.acl` | `/var/kerberos/krb5kdc/kadm5.acl` |
| Base | `/var/lib/krb5kdc/` | `/var/kerberos/krb5kdc/` |
| Services | `krb5-kdc`, `krb5-admin-server` | `krb5kdc`, `kadmin` |

```text /etc/krb5kdc/kadm5.acl
*/admin@EXEMPLE.FR    *
helpdesk@EXEMPLE.FR   cpi    *@EXEMPLE.FR
```

`*` = tous les droits ; `c` changer un mot de passe, `p` propager, `i` interroger, `l` lister, `a` ajouter, `m` modifier, `d` supprimer. Deuxième ligne : le principal `helpdesk` peut changer les mots de passe et consulter les principaux du royaume.

### DNS et pare-feu

```text zone exemple.fr
_kerberos._udp.exemple.fr.        SRV 0 0 88  kdc1.exemple.fr.
_kerberos._udp.exemple.fr.        SRV 0 0 88  kdc2.exemple.fr.
_kerberos._tcp.exemple.fr.        SRV 0 0 88  kdc1.exemple.fr.
_kerberos-master._udp.exemple.fr. SRV 0 0 88  kdc1.exemple.fr.
_kerberos-adm._tcp.exemple.fr.    SRV 0 0 749 kdc1.exemple.fr.
_kpasswd._udp.exemple.fr.         SRV 0 0 464 kdc1.exemple.fr.
_kerberos.exemple.fr.             TXT "EXEMPLE.FR"
```

```bash
dig +short SRV _kerberos._udp.exemple.fr
dig +short SRV _kerberos-adm._tcp.exemple.fr
# Ports : 88 tcp/udp (KDC), 464 tcp/udp (kpasswd), 749 tcp (kadmin), 754 tcp (kprop)
sudo firewall-cmd --permanent --add-service=kerberos --add-service=kpasswd --add-service=kadmin && sudo firewall-cmd --reload
sudo ufw allow 88 && sudo ufw allow 464 && sudo ufw allow 749/tcp
```

## Royaume, clé maîtresse et service

```bash
sudo kdb5_util create -s -r EXEMPLE.FR             # base + fichier de stash (clé maîtresse)
sudo systemctl enable --now krb5-kdc krb5-admin-server      # Debian (RHEL : krb5kdc kadmin)
sudo systemctl status krb5-kdc
sudo kdb5_util stash                                # recréer le fichier de stash

# Rotation de la clé maîtresse
sudo kdb5_util add_mkey -s
sudo kdb5_util list_mkeys
sudo kdb5_util use_mkey 2                           # numéro affiché par list_mkeys
sudo kdb5_util update_princ_encryption -f
sudo kdb5_util purge_mkeys -f
```

## Principaux

```bash
sudo kadmin.local -q "addprinc admin/admin"
sudo kadmin.local -q "addprinc amartin"
sudo kadmin.local -q "addprinc -pw MotDePasseTemporaire +needchange amartin2"   # changement exigé
sudo kadmin.local -q "addprinc -expire 2026-12-31 -policy standard prestataire"
sudo kadmin.local -q "addprinc -randkey host/srv-web01.exemple.fr"
sudo kadmin.local -q "addprinc -randkey HTTP/srv-web01.exemple.fr"

sudo kadmin.local -q "listprincs"
sudo kadmin.local -q "listprincs */admin@EXEMPLE.FR"
sudo kadmin.local -q "listprincs host/*"
sudo kadmin.local -q "getprinc amartin"              # dates, kvno, clés, politique, échecs
sudo kadmin.local -q "getprinc -terse amartin"

sudo kadmin.local -q "cpw amartin"                   # changer le mot de passe (saisie)
sudo kadmin.local -q "cpw -randkey HTTP/srv-web01.exemple.fr"
sudo kadmin.local -q "modprinc -maxlife 10h -maxrenewlife 7d amartin"
sudo kadmin.local -q "modprinc +requires_preauth amartin"
sudo kadmin.local -q "modprinc -expire never prestataire"
sudo kadmin.local -q "modprinc -pwexpire 2026-12-31 amartin"
sudo kadmin.local -q "modprinc -allow_tix ancien"     # désactiver sans supprimer
sudo kadmin.local -q "modprinc +allow_tix ancien"
sudo kadmin.local -q "modprinc -unlock amartin"       # après trop d'échecs
sudo kadmin.local -q "renprinc amartin amartin-durand"
sudo kadmin.local -q "delprinc -force ancien"
sudo kadmin.local -q "purgekeys -keepkvno 3 HTTP/srv-web01.exemple.fr"   # supprimer les clés plus anciennes que le kvno 3

# Chaînes de principal : types de chiffrement de session imposés
sudo kadmin.local -q "set_string HTTP/srv-web01.exemple.fr session_enctypes aes256-cts-hmac-sha1-96"
sudo kadmin.local -q "get_strings HTTP/srv-web01.exemple.fr"

# Depuis un poste d'administration
kadmin -p admin/admin -q "listprincs host/*"
kadmin -p admin/admin -q "getprivs"
```

## Politiques de mots de passe

```bash
sudo kadmin.local -q "addpol -minlength 12 -minclasses 3 -history 10 -maxlife 180d -maxfailure 10 -failurecountinterval 15m -lockoutduration 15m standard"
sudo kadmin.local -q "addpol -minlength 20 -maxfailure 5 -lockoutduration 30m admins"
sudo kadmin.local -q "listpols"
sudo kadmin.local -q "getpol standard"
sudo kadmin.local -q "modpol -maxlife 90d standard"
sudo kadmin.local -q "modprinc -policy standard amartin"
sudo kadmin.local -q "modprinc -clearpolicy amartin"
sudo kadmin.local -q "delpol ancienne"
```

## Keytabs

```bash
# Extraire les clés d'un service (attention : ktadd régénère les clés, sauf -norandkey en kadmin.local)
sudo kadmin.local -q "ktadd -k /etc/krb5.keytab host/srv-web01.exemple.fr"
sudo kadmin.local -q "ktadd -k /etc/httpd/http.keytab -e aes256-cts-hmac-sha1-96:normal,aes128-cts-hmac-sha1-96:normal HTTP/srv-web01.exemple.fr"
sudo kadmin.local -q "ktadd -norandkey -k /tmp/copie.keytab HTTP/srv-web01.exemple.fr"
sudo kadmin.local -q "ktremove -k /etc/httpd/http.keytab HTTP/srv-web01.exemple.fr old"   # retirer les anciens kvno

# Lire, tester, protéger
klist -k -t -e /etc/krb5.keytab
kinit -k -t /etc/krb5.keytab host/srv-web01.exemple.fr && klist
sudo chown root:apache /etc/httpd/http.keytab && sudo chmod 640 /etc/httpd/http.keytab

# Renouveler les clés d'hôte depuis l'hôte lui-même
sudo k5srvutil list -k /etc/krb5.keytab
sudo k5srvutil change -k /etc/krb5.keytab
sudo k5srvutil delold -k /etc/krb5.keytab
```

Fusionner ou copier des keytabs avec `ktutil` (session interactive) :

```text
ktutil
rkt /etc/krb5.keytab
rkt /etc/httpd/http.keytab
list -e
wkt /root/sauvegarde-keytabs.keytab
quit
```

Keytab d'un compte de service **Active Directory** créée sous Linux (MIT 1.19+ : `-f` récupère le sel auprès du KDC) :

```text
ktutil
addent -password -p svc-linux@CORP.EXEMPLE.FR -k 1 -e aes256-cts-hmac-sha1-96 -f
wkt /etc/svc-linux.keytab
quit
```

## Côté client

```text /etc/krb5.conf
[libdefaults]
    default_realm = EXEMPLE.FR
    dns_lookup_kdc = true
    dns_lookup_realm = false
    rdns = false
    forwardable = true
    ticket_lifetime = 10h
    renew_lifetime = 7d

[realms]
    EXEMPLE.FR = {
        kdc = kdc1.exemple.fr
        kdc = kdc2.exemple.fr
        admin_server = kdc1.exemple.fr
    }

[domain_realm]
    .exemple.fr = EXEMPLE.FR
    exemple.fr = EXEMPLE.FR
```

```bash
kinit amartin                                     # TGT
kinit -l 1h amartin                               # durée de vie réduite
kinit -r 7d amartin                               # renouvelable 7 jours
kinit -R                                          # renouveler sans mot de passe
kinit -f amartin                                  # transférable (délégation SSH)
kinit -V amartin                                  # mode verbeux
kinit -k -t /etc/krb5.keytab host/srv-web01.exemple.fr
kinit -c FILE:/tmp/krb5cc_test amartin            # cache dédié
klist                                             # tickets du cache courant
klist -e                                          # types de chiffrement
klist -f                                          # indicateurs (F transférable, R renouvelable, I initial)
klist -A                                          # tous les caches (collection KCM ou DIR)
klist -l                                          # liste des caches
kswitch -p admin/admin                            # changer de cache actif
kvno HTTP/srv-web01.exemple.fr                    # ticket de service : SPN existant, kvno affiché
kvno -S HTTP srv-web01.exemple.fr                 # même chose à partir du service et de l'hôte
kpasswd                                           # changer son mot de passe
kdestroy
kdestroy -A                                       # tous les caches
export KRB5CCNAME=KCM:                            # cache géré par SSSD (KCM)
KRB5_TRACE=/dev/stderr kinit amartin              # trace : fichiers lus, DNS, KDC contactés, erreurs
KRB5_TRACE=/dev/stderr kvno HTTP/srv-web01.exemple.fr
```

### SSH avec Kerberos (GSSAPI)

```text /etc/ssh/sshd_config.d/kerberos.conf
GSSAPIAuthentication yes
GSSAPICleanupCredentials yes
```

```bash
kinit -f amartin
ssh -o GSSAPIAuthentication=yes amartin@srv-web01.exemple.fr
ssh -K amartin@srv-web01.exemple.fr               # déléguer le ticket (rebond)
```

Le serveur SSH a besoin du principal `host/srv-web01.exemple.fr` dans `/etc/krb5.keytab`.

## Propagation vers les KDC secondaires

```bash
# Sur le KDC secondaire : principal d'hôte, keytab, liste des KDC autorisés, service kpropd
sudo kadmin -p admin/admin -q "addprinc -randkey host/kdc2.exemple.fr"
sudo kadmin -p admin/admin -q "ktadd host/kdc2.exemple.fr"
echo "host/kdc1.exemple.fr@EXEMPLE.FR" | sudo tee /etc/krb5kdc/kpropd.acl     # RHEL : /var/kerberos/krb5kdc/kpropd.acl
sudo apt install krb5-kpropd                      # Debian / Ubuntu
sudo systemctl enable --now kprop                 # RHEL (service kpropd du paquet krb5-server)

# Sur le KDC principal : vidage puis propagation (à planifier, par exemple toutes les 10 min)
sudo kdb5_util dump /var/lib/krb5kdc/replica_datatrans
sudo kprop -f /var/lib/krb5kdc/replica_datatrans kdc2.exemple.fr
echo '*/10 * * * * root kdb5_util dump /var/lib/krb5kdc/replica_datatrans && kprop -f /var/lib/krb5kdc/replica_datatrans kdc2.exemple.fr' | sudo tee /etc/cron.d/kprop
```

Propagation **incrémentale** (iprop) : dans `kdc.conf`, section du royaume, `iprop_enable = true` et `iprop_port = 754` sur les deux KDC ; le secondaire lance `kpropd` qui demande les changements au principal.

## Sauvegarde et restauration

```bash
sudo kdb5_util dump /var/backups/krb5-$(date +%F).dump
sudo kdb5_util load /var/backups/krb5-2026-11-15.dump
sudo cp -a /etc/krb5kdc/ /var/backups/krb5kdc-config-$(date +%F)/     # inclut le stash : à protéger
```

## Windows

```powershell
klist                                             # tickets de la session
klist tgt
klist sessions
klist purge
klist -li 0x3e7 purge                             # tickets du compte ordinateur
klist get HTTP/srv-web01.corp.exemple.fr
setspn -L svc-web
setspn -S HTTP/intranet.corp.exemple.fr CORP\svc-web     # ajoute en refusant les doublons
setspn -D HTTP/intranet.corp.exemple.fr CORP\svc-web
setspn -X -F                                      # doublons dans la forêt
nltest /dsgetdc:corp.exemple.fr /kdc
# Keytab pour un service Linux lié à un compte AD
ktpass -princ HTTP/srv-linux.corp.exemple.fr@CORP.EXEMPLE.FR -mapuser CORP\svc-linux -crypto AES256-SHA1 -ptype KRB5_NT_PRINCIPAL -pass * -out C:\Temp\srv-linux.keytab
# Poste Windows face à un royaume MIT
ksetup /addkdc EXEMPLE.FR kdc1.exemple.fr
ksetup /mapuser amartin@EXEMPLE.FR amartin
ksetup /dumpstate
```

## Erreurs fréquentes

| Message | Cause | Correction |
| --- | --- | --- |
| `Clock skew too great` | Horloges décalées de plus de 5 min | NTP (`chronyc tracking`, `w32tm /query /status`) |
| `Server not found in Kerberos database` | SPN absent ou mal orthographié (alias DNS, majuscules) | `listprincs`, `setspn -Q`, nom canonique |
| `Client not found in Kerberos database` | Principal inexistant ou mauvais royaume | `getprinc`, `default_realm` |
| `Preauthentication failed` | Mot de passe faux | Réinitialiser (`cpw`) ; vérifier le verrouillage |
| `Clients credentials have been revoked` | Compte verrouillé (politique) ou désactivé | `modprinc -unlock`, `+allow_tix` |
| `Key version number for principal in key table is incorrect` | Keytab obsolète (clés changées depuis) | Réextraire la keytab |
| `Decrypt integrity check failed` | Keytab ou mot de passe ne correspondant pas | Comparer les kvno (`klist -k`, `kvno`) |
| `KDC has no support for encryption type` | Types de chiffrement incompatibles (DES, RC4 retirés) | Clés AES sur le principal et la keytab |
| `Cannot find KDC for realm` | `krb5.conf` incomplet ou SRV `_kerberos._udp` absents | `[realms]` ou `dig SRV` |
| `Ticket expired` | TGT expiré | `kinit` ou `kinit -R` |
| `No credentials cache found` | Pas de `kinit`, mauvais `KRB5CCNAME` | `klist -l`, `kinit` |

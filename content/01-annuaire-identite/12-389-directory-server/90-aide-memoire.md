---
title: 389 Directory Server — aide-mémoire des commandes
description: Référence complète des commandes 389 Directory Server (outils lib389 dscreate, dsctl, dsconf, dsidm) avec exemples — installation (RHEL, Fedora, Debian, openSUSE, Cockpit), création et suppression d'instance par fichier .inf, fichier .dsrc, service, configuration (cn=config, liaisons sécurisées), suffixes et index, TLS (certificats, AC, version minimale), politiques de mots de passe globale et locale, greffons (memberOf et correction, intégrité référentielle, unicité d'attribut), utilisateurs, groupes, comptes (verrouillage, état, mot de passe), génération de la configuration client SSSD, réplication multi-fournisseur (activation, accords, initialisation, état, RUV, nettoyage), sauvegarde et restauration en ligne et hors ligne, export et import LDIF, supervision, journaux et contrôle de santé.
tags: [aide-mémoire, 389 directory server, 389-ds, dsconf, dsctl, dsidm, dscreate, ldap, réplication]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|389 Directory Server]] et [[03-interface-graphique|interface graphique (Cockpit)]]. Exemples : instance `corp`, suffixe `dc=corp,dc=exemple,dc=fr`, base `userroot`, serveurs `ldap-01` et `ldap-02.corp.exemple.fr`.

> [!TIP]
> En root sur le serveur, `dsconf corp …` et `dsidm corp …` se connectent par le socket local (LDAPI) sans mot de passe. À distance, remplacez `corp` par l'URL : `dsconf ldaps://ldap-01.corp.exemple.fr -D "cn=Directory Manager" …`. `dsidm` a besoin de la base : `-b dc=corp,dc=exemple,dc=fr`, ou un fichier `~/.dsrc`.

## Installation

```bash
sudo dnf install 389-ds-base                          # RHEL 9 / Rocky / Alma / Fedora
sudo apt install 389-ds-base                          # Debian / Ubuntu
sudo zypper install 389-ds                            # openSUSE
sudo dnf install cockpit cockpit-389-ds && sudo systemctl enable --now cockpit.socket   # console web (port 9090)
sudo firewall-cmd --permanent --add-service=ldap --add-service=ldaps && sudo firewall-cmd --reload
```

## Instance

```bash
# Modèle commenté, puis création
dscreate create-template /root/corp.inf
```

```ini /root/corp.inf (extrait)
[general]
full_machine_name = ldap-01.corp.exemple.fr

[slapd]
instance_name = corp
root_password = MotDePasseDirectoryManager
port = 389
secure_port = 636

[backend-userroot]
suffix = dc=corp,dc=exemple,dc=fr
sample_entries = yes
```

```bash
sudo dscreate from-file /root/corp.inf
sudo dscreate interactive                             # questions pas à pas
dsctl -l                                              # instances présentes
sudo dsctl corp status
sudo dsctl corp restart
sudo systemctl status dirsrv@corp
sudo dsctl corp remove --do-it                        # supprimer l'instance (irréversible)
```

```ini ~/.dsrc
[corp]
uri = ldapi://%%2fvar%%2frun%%2fslapd-corp.socket
basedn = dc=corp,dc=exemple,dc=fr
binddn = cn=Directory Manager
```

## Configuration

```bash
sudo dsconf corp config get
sudo dsconf corp config get nsslapd-require-secure-binds nsslapd-allow-anonymous-access
sudo dsconf corp config replace nsslapd-require-secure-binds=on
sudo dsconf corp config replace nsslapd-allow-anonymous-access=rootdse     # anonyme limité au RootDSE
sudo dsconf corp config replace nsslapd-sizelimit=2000 nsslapd-timelimit=60
sudo dsconf corp config replace nsslapd-accesslog-level=256
```

## Suffixes et index

```bash
sudo dsconf corp backend suffix list
sudo dsconf corp backend create --suffix "dc=partenaires,dc=exemple,dc=fr" --be-name partenaires
sudo dsconf corp backend index list userroot
sudo dsconf corp backend index add --attr mail --index-type eq --index-type sub --reindex userroot
sudo dsconf corp backend index reindex --attr mail userroot
sudo dsconf corp backend config get
```

## TLS

```bash
sudo dsconf corp security get
sudo dsconf corp security certificate list
sudo dsconf corp security ca-certificate list
sudo dsconf corp security ca-certificate add --file /root/ca-corp.crt --name "AC Corp"
sudo dsconf corp security ca-certificate set-trust-flags "AC Corp" --flags "CT,,"
sudo dsconf corp security certificate add --file /root/ldap-01.crt --name "Server-Cert-2026"
sudo dsconf corp security set --tls-protocol-min TLS1.2
sudo dsctl corp restart
openssl s_client -connect ldap-01.corp.exemple.fr:636 -showcerts </dev/null | openssl x509 -noout -subject -enddate
```

## Politiques de mots de passe

```bash
sudo dsconf corp pwpolicy get
sudo dsconf corp pwpolicy set --pwdlockout on --pwdmaxfailures 5 --pwdlockoutduration 900 --pwdminlen 12 --pwdhistory on --pwdhistorycount 10 --pwdmustchange on
# Politique locale (plus stricte) pour une branche
sudo dsconf corp localpwp addsubtree "ou=admins,dc=corp,dc=exemple,dc=fr"
sudo dsconf corp localpwp set "ou=admins,dc=corp,dc=exemple,dc=fr" --pwdminlen 20
sudo dsconf corp localpwp list
```

## Greffons

```bash
sudo dsconf corp plugin list
sudo dsconf corp plugin memberof status
sudo dsconf corp plugin memberof enable
sudo dsconf corp plugin memberof set --scope "dc=corp,dc=exemple,dc=fr"
sudo dsconf corp plugin memberof fixup "dc=corp,dc=exemple,dc=fr"           # recalculer memberOf
sudo dsconf corp plugin referential-integrity enable
sudo dsconf corp plugin attr-uniq add "unicite-mail" --attr-name mail --subtree "dc=corp,dc=exemple,dc=fr"
sudo dsconf corp plugin attr-uniq enable "unicite-mail"
sudo dsctl corp restart                                                    # après activation d'un greffon
```

## Utilisateurs, groupes, comptes

```bash
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" user list
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" user create --uid amartin --cn "Alice Martin" --displayName "Alice Martin" --uidNumber 10001 --gidNumber 10001 --homeDirectory /home/amartin
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" user get amartin
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" user modify amartin add:mail:alice.martin@exemple.fr add:loginShell:/bin/bash
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" user delete "uid=bpetit,ou=people,dc=corp,dc=exemple,dc=fr"

sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" account reset_password "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr"
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" account entry-status "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr"
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" account lock "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr"
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" account unlock "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr"

sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" group create --cn reseau
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" group add_member reseau "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr"
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" group members reseau
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" posixgroup create --cn reseau-posix --gidNumber 10000
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" organizationalunit list

# Configuration cliente prête à l'emploi
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" client_config sssd.conf
sudo dsidm corp -b "dc=corp,dc=exemple,dc=fr" client_config ldap.conf
```

## Réplication multi-fournisseur

```bash
# Sur chaque serveur (replica-id différent : 1, 2…), même compte de réplication
sudo dsconf corp replication enable --suffix "dc=corp,dc=exemple,dc=fr" --role supplier --replica-id 1 --bind-dn "cn=replication manager,cn=config" --bind-passwd 'MotDePasseReplication'

# Accord ldap-01 → ldap-02, puis initialisation de ldap-02 depuis ldap-01
sudo dsconf corp repl-agmt create --suffix "dc=corp,dc=exemple,dc=fr" --host ldap-02.corp.exemple.fr --port 636 --conn-protocol LDAPS --bind-dn "cn=replication manager,cn=config" --bind-passwd 'MotDePasseReplication' --bind-method SIMPLE ldap01-vers-ldap02
sudo dsconf corp repl-agmt init --suffix "dc=corp,dc=exemple,dc=fr" ldap01-vers-ldap02
sudo dsconf corp repl-agmt init-status --suffix "dc=corp,dc=exemple,dc=fr" ldap01-vers-ldap02
# Accord retour ldap-02 → ldap-01 (sur ldap-02), sans initialisation

# État
sudo dsconf corp repl-agmt list --suffix "dc=corp,dc=exemple,dc=fr"
sudo dsconf corp repl-agmt status --suffix "dc=corp,dc=exemple,dc=fr" ldap01-vers-ldap02
sudo dsconf corp replication status --suffix "dc=corp,dc=exemple,dc=fr"
sudo dsconf corp replication monitor
sudo dsconf corp replication get-ruv --suffix "dc=corp,dc=exemple,dc=fr"
# Après le retrait définitif d'un serveur (replica-id 3) : nettoyer ses traces dans la RUV
sudo dsconf corp repl-tasks cleanallruv --suffix "dc=corp,dc=exemple,dc=fr" --replica-id 3
```

## Sauvegarde, restauration, LDIF

```bash
# En ligne
sudo dsconf corp backup create
ls /var/lib/dirsrv/slapd-corp/bak/
sudo dsconf corp backup restore /var/lib/dirsrv/slapd-corp/bak/corp-2026_11_15_02_00_00
sudo dsconf corp backend export userroot                                    # LDIF dans /var/lib/dirsrv/slapd-corp/ldif/
sudo dsconf corp backend import userroot /var/lib/dirsrv/slapd-corp/ldif/import.ldif

# Hors ligne (instance arrêtée)
sudo dsctl corp stop
sudo dsctl corp db2bak
sudo dsctl corp bak2db /var/lib/dirsrv/slapd-corp/bak/corp-2026_11_15_02_00_00
sudo dsctl corp db2ldif --replication userroot /tmp/userroot-repl.ldif      # avec les données de réplication
sudo dsctl corp ldif2db userroot /tmp/import.ldif
sudo dsctl corp db2index userroot
sudo dsctl corp dbverify userroot
sudo dsctl corp start
```

## Supervision, journaux, santé

```bash
sudo dsctl corp healthcheck                                                # TLS, réplication, index, configuration
sudo dsconf corp monitor server
sudo dsconf corp monitor backend
sudo dsconf corp monitor snmp
sudo tail -f /var/log/dirsrv/slapd-corp/errors
sudo tail -f /var/log/dirsrv/slapd-corp/access
sudo grep -E "err=49|err=50" /var/log/dirsrv/slapd-corp/access | tail      # échecs de liaison, accès refusés
ldapsearch -H ldaps://ldap-01.corp.exemple.fr -D "cn=Directory Manager" -W -b "cn=monitor" -s base currentconnections totalconnections
ldapsearch -H ldaps://ldap-01.corp.exemple.fr -D "cn=Directory Manager" -W -b "dc=corp,dc=exemple,dc=fr" "(uid=amartin)"
```

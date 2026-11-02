---
title: Présentation, installation et exploitation
description: 389 Directory Server (389-DS) — annuaire LDAPv3 d'entreprise de la communauté Fedora (amont de Red Hat Directory Server, utilisé par FreeIPA), installation sur Fedora, RHEL/Rocky/Alma (module 389-ds) et openSUSE, création d'instance (dscreate, fichier .inf), suffixes et unités, utilisateurs et groupes (dsidm), TLS, politique de mots de passe, réplication multi-maîtres, plug-ins (memberOf, unicité), sauvegarde et restauration, supervision et dépannage.
tags: [389 directory server, 389-ds, ldap, annuaire, réplication, dsconf, dsidm]
icon: info
---

**389 Directory Server** (GPL) est un annuaire **LDAPv3** performant et éprouvé : réplication **multi-maîtres**, plug-ins (memberOf, intégrité référentielle, unicité d'attributs), politique de mots de passe fine, outils modernes en Python (`dscreate`, `dsconf`, `dsidm`, `dsctl`) et console web dans **Cockpit**. C'est le moteur LDAP de [[03-freeipa/01-presentation-installation|FreeIPA]] et de Red Hat Directory Server. Alternative à [[02-openldap/01-presentation-installation|OpenLDAP]].

## Installation

```bash
sudo dnf install -y 389-ds-base cockpit-389-ds          # Fedora, RHEL/Rocky/Alma 9 et 10
sudo zypper install 389-ds                               # openSUSE
```

Sous Debian/Ubuntu, le paquet `389-ds-base` existe mais l'écosystème (console, documentation) est centré sur la famille Red Hat : préférez une VM Rocky/Alma.

## Création d'une instance

```ini /root/instance.inf
[general]
full_machine_name = ldap-01.corp.exemple.fr
start = True

[slapd]
instance_name = corp
root_dn = cn=Directory Manager
root_password = MotDePasse-Tres-Long-2026
port = 389
secure_port = 636
self_sign_cert = True

[backend-userroot]
suffix = dc=corp,dc=exemple,dc=fr
sample_entries = yes
```

```bash
sudo dscreate from-file /root/instance.inf
sudo dsctl corp status
sudo firewall-cmd --permanent --add-service={ldap,ldaps} && sudo firewall-cmd --reload
ldapsearch -x -H ldap://localhost -b dc=corp,dc=exemple,dc=fr -s base
```

`sample_entries = yes` crée `ou=people`, `ou=groups` et des ACI de base. Fichier `~/.dsrc` pour ne pas répéter l'instance et l'URI :

```ini ~/.dsrc
[corp]
uri = ldapi://%%2fvar%%2frun%%2fslapd-corp.socket
basedn = dc=corp,dc=exemple,dc=fr
binddn = cn=Directory Manager
```

## Utilisateurs et groupes

```bash
sudo dsidm corp user create --uid alice --cn "Alice Martin" --displayName "Alice Martin" \
  --uidNumber 10001 --gidNumber 10001 --homeDirectory /home/alice
sudo dsidm corp account reset_password uid=alice,ou=people,dc=corp,dc=exemple,dc=fr
sudo dsidm corp group create --cn admins-linux
sudo dsidm corp group add_member admins-linux uid=alice,ou=people,dc=corp,dc=exemple,dc=fr
sudo dsidm corp user list
```

## TLS et politique de mots de passe

```bash
sudo dsconf corp security certificate add --file /etc/pki/tls/certs/ldap-01.pem --name "Serveur"
sudo dsconf corp security set --tls-protocol-min TLS1.2
sudo dsconf corp security rsa set --nss-cert-name "Serveur"
sudo dsctl corp restart
sudo dsconf corp pwpolicy set --pwdlockout on --pwdmaxfailures 5 --pwdlockoutduration 900 \
  --pwdminlength 12 --pwdhistory on --pwdhistorycount 5 --pwdmaxage 31536000
sudo dsconf corp plugin memberof enable && sudo dsctl corp restart
```

Imposez le chiffrement : `sudo dsconf corp config replace nsslapd-require-secure-binds=on`.

## Réplication multi-maîtres

```bash
# Sur ldap-01 et ldap-02 : activer la réplication avec un identifiant différent
sudo dsconf corp replication enable --suffix dc=corp,dc=exemple,dc=fr --role supplier --replica-id 1 \
  --bind-dn "cn=replication manager,cn=config" --bind-passwd 'MdpReplication'
# Sur ldap-01 : accord vers ldap-02 puis initialisation
sudo dsconf corp repl-agmt create --suffix dc=corp,dc=exemple,dc=fr --host ldap-02.corp.exemple.fr --port 636 \
  --conn-protocol LDAPS --bind-dn "cn=replication manager,cn=config" --bind-passwd 'MdpReplication' --bind-method SIMPLE --init vers-ldap-02
sudo dsconf corp repl-agmt init-status --suffix dc=corp,dc=exemple,dc=fr vers-ldap-02
```

Créez l'accord inverse depuis ldap-02 (sans `--init`) ; surveillez avec `dsconf corp replication monitor`.

## Sauvegarde et restauration

```bash
sudo dsconf corp backup create                     # sauvegarde en ligne (répertoire bak/)
sudo dsctl corp db2ldif --replication userroot /var/lib/dirsrv/slapd-corp/ldif/export.ldif
sudo dsctl corp stop && sudo dsctl corp bak2db <dossier> && sudo dsctl corp start
```

## Dépannage

| Symptôme | Cause et correction |
| --- | --- |
| `Can't contact LDAP server` | Instance arrêtée (`dsctl corp status`), pare-feu, certificat TLS |
| `Insufficient access` | ACI : vérifier avec `dsconf corp aci` / l'onglet *Access Control* de la console |
| Réplication bloquée | Mot de passe du gestionnaire, horloges, conflits : `dsconf corp replication monitor` |

Journaux : `/var/log/dirsrv/slapd-corp/{access,errors}`. Console : [[03-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].

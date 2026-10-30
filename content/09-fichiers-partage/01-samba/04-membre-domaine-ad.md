---
title: Serveur membre d'un domaine Active Directory
description: Joindre un serveur Samba à Active Directory avec winbind — prérequis DNS et heure, krb5.conf, smb.conf (security = ADS), choix du backend idmap (rid, ad, autorid), jonction avec net ads ou realmd, NSS/PAM, privilèges de gestion depuis Windows, tests wbinfo et getent.
tags: [samba, active directory, winbind, idmap, kerberos, net ads, realmd, nsswitch]
icon: link
---

En **membre de domaine**, Samba authentifie les utilisateurs AD (Kerberos/NTLM via les contrôleurs de domaine), applique les **ACL Windows** et convertit les SID en UID/GID grâce à **winbind**.

## Prérequis

| Élément | Exigence |
| --- | --- |
| DNS | Le serveur utilise les **DNS du domaine** (résolution des enregistrements SRV `_ldap._tcp`, `_kerberos._tcp`) |
| Nom | Nom d'hôte court ≤ 15 caractères, FQDN dans le domaine (`fs01.corp.exemple.fr`) |
| Heure | Synchronisée avec les DC (écart < 5 min pour Kerberos) : chrony vers les DC |
| Compte | Un compte autorisé à joindre des ordinateurs (délégation sur l'OU cible) |
| Ports | Accès aux DC : 53, 88, 135, 389, 445, 464, 49152-65535 |

```bash
hostnamectl set-hostname fs01.corp.exemple.fr
resolvectl dns ens192 10.0.10.11 10.0.10.12 && resolvectl domain ens192 corp.exemple.fr
host -t SRV _ldap._tcp.corp.exemple.fr
chronyc sources
```

## Paquets

```bash
# Debian / Ubuntu
sudo apt install samba winbind libnss-winbind libpam-winbind krb5-user smbclient
# RHEL
sudo dnf install samba samba-winbind samba-winbind-clients samba-winbind-modules krb5-workstation
```

## Kerberos

```krb5 /etc/krb5.conf
[libdefaults]
    default_realm = CORP.EXEMPLE.FR
    dns_lookup_realm = false
    dns_lookup_kdc = true
    rdns = false
```

## smb.conf

```smb /etc/samba/smb.conf
[global]
   workgroup = CORP
   realm = CORP.EXEMPLE.FR
   security = ADS
   server role = member server
   kerberos method = secrets and keytab
   winbind refresh tickets = yes
   dedicated keytab file = /etc/krb5.keytab

   # Correspondance SID -> UID/GID
   idmap config * : backend = tdb
   idmap config * : range = 3000-7999
   idmap config CORP : backend = rid
   idmap config CORP : range = 10000-999999

   winbind use default domain = yes      # « alice » au lieu de « CORP\alice »
   winbind enum users = no
   winbind enum groups = no
   template shell = /usr/sbin/nologin    # /bin/bash si connexions SSH des utilisateurs AD
   template homedir = /home/%U

   # ACL Windows complètes
   vfs objects = acl_xattr
   map acl inherit = yes
   store dos attributes = yes

   server min protocol = SMB2_10
   server signing = mandatory
   disable netbios = yes
   log file = /var/log/samba/log.%m
   username map = /etc/samba/user.map
```

```text /etc/samba/user.map
!root = CORP\Administrateur
```

> [!NOTE]
> Depuis Samba 4.8, un serveur membre **doit** exécuter winbindd. SSSD peut gérer les connexions des utilisateurs au système, mais le service de fichiers Samba s'appuie sur winbind.

## Choisir le backend idmap

| Backend | Principe | Quand l'utiliser |
| --- | --- | --- |
| **rid** | UID = début de plage + RID du SID : déterministe, aucun attribut AD requis | Un seul domaine (ou une plage par domaine approuvé) ; **mêmes plages sur tous les serveurs** |
| **ad** | Lit `uidNumber` / `gidNumber` (RFC 2307) dans AD | Mêmes UID partout (NFS, SSSD, plusieurs serveurs Linux) ; attributs à renseigner |
| **autorid** | Attribue automatiquement une plage par domaine | Forêts multi-domaines, approbations nombreuses |
| tdb (`*`) | Plage par défaut pour les SID « bien connus » et les autres domaines | Toujours définie |

> [!WARNING]
> Les plages ne doivent **pas se chevaucher** entre elles ni avec les comptes locaux, et **ne doivent plus changer** une fois des fichiers créés : modifier le backend ou la plage change les UID et casse les droits.

## Joindre le domaine

```bash
testparm -s
sudo net ads join -U administrateur           # ou un compte délégué ; option createcomputer="Serveurs/Fichiers"
sudo net ads testjoin
sudo systemctl enable --now smbd winbind      # RHEL : smb winbind
sudo systemctl disable --now nmbd
```

Alternative avec **realmd** :

```bash
sudo realm join --membership-software=samba --client-software=winbind corp.exemple.fr -U administrateur
```

realmd produit une configuration de base ; complétez ensuite `smb.conf` (idmap, ACL).

## NSS et PAM

```text /etc/nsswitch.conf (extrait)
passwd:     files winbind
group:      files winbind
```

```bash
# Debian : connexions des utilisateurs AD au système (SSH, console) si nécessaire
sudo pam-auth-update --enable winbind mkhomedir
```

## Vérifier

```bash
wbinfo --ping-dc
wbinfo -t                                   # relation d'approbation du compte machine
wbinfo -u | head ; wbinfo -g | head
id alice                                    # uid=11104(alice) gid=10513(utilisateurs du domaine) …
getent group "admins du domaine"
smbclient -L fs01 -k                        # avec un ticket Kerberos (kinit alice)
```

## Administration depuis Windows

Pour que les administrateurs gèrent les **droits de partage** depuis la console *Gestion de l'ordinateur* :

```bash
sudo net rpc rights grant "CORP\Admins du domaine" SeDiskOperatorPrivilege -U "CORP\administrateur"
net rpc rights list privileges SeDiskOperatorPrivilege -U "CORP\administrateur"
```

Les noms de groupes AD dépendent de la langue d'installation du domaine (*Domain Admins* / *Admins du domaine*).

### Partage géré par les ACL Windows

```bash
sudo mkdir -p /srv/samba/donnees
sudo chown root:"admins du domaine" /srv/samba/donnees
sudo chmod 0770 /srv/samba/donnees
```

```smb
[donnees]
   path = /srv/samba/donnees
   read only = no
```

Connectez-vous ensuite depuis Windows avec un compte *Admins du domaine*, puis réglez les permissions dans l'onglet **Sécurité** du dossier (`\\fs01\donnees` → Propriétés). Détails : [[05-permissions-acl]].

---
title: Samba contrôleur de domaine AD
description: Déployer Samba en contrôleur de domaine Active Directory — prérequis, provisionnement (samba-tool domain provision), DNS interne ou BIND9_DLZ, Kerberos, synchronisation horaire signée, DC supplémentaire, réplication et FSMO, SYSVOL, gestion des utilisateurs et GPO, sauvegarde, niveaux fonctionnels et limites face à Windows Server.
tags: [samba, active directory, samba-tool, dc, kerberos, dns, sysvol, fsmo, gpo]
icon: crown
---

Samba peut **être** le domaine : LDAP, Kerberos (Heimdal), DNS, GPO, compatible avec les postes Windows et les outils RSAT. C'est une alternative sans licence à Windows Server pour les PME, laboratoires et sites distants.

## Limites à connaître

| Fonction | Samba AD DC |
| --- | --- |
| Postes Windows, GPO, RSAT (consoles MMC, GPMC) | ✅ |
| **Module PowerShell ActiveDirectory** (ADWS) | ❌ Service Web AD non implémenté : `Get-ADUser` ne fonctionne pas contre un DC Samba |
| **Réplication SYSVOL** (DFS-R / FRS) | ❌ À organiser soi-même (rsync, osync) |
| Niveau fonctionnel | 2008 R2 par défaut ; 2012 R2 / 2016 à partir de 4.19 (`ad dc functional level`) |
| Mélange avec des DC Windows | Possible, mais déconseillé à long terme (SYSVOL, fonctions récentes) |
| RODC | Partiel |
| Serveur de fichiers sur le DC | Possible mais déconseillé : utiliser un serveur membre |

## Prérequis

```bash
hostnamectl set-hostname dc1.corp.exemple.fr
```

```text /etc/hosts
127.0.0.1     localhost
10.0.10.11    dc1.corp.exemple.fr dc1
```

- Adresse IP **fixe** ; supprimer toute ligne `127.0.1.1 dc1` ;
- Nom de domaine DNS dédié (ex. `corp.exemple.fr`), jamais `.local` ;
- Pas de `smbd`/`nmbd`/`winbind` en tant que services séparés.

## Provisionnement (Debian / Ubuntu)

```bash
sudo apt install samba winbind krb5-user smbclient ldb-tools
# (et samba-ad-dc / samba-ad-provision selon les versions de la distribution)
sudo systemctl disable --now smbd nmbd winbind
sudo systemctl unmask samba-ad-dc
sudo mv /etc/samba/smb.conf /etc/samba/smb.conf.orig

sudo samba-tool domain provision --use-rfc2307 \
    --realm=CORP.EXEMPLE.FR --domain=CORP \
    --server-role=dc --dns-backend=SAMBA_INTERNAL \
    --adminpass='MotDePasseAdministrateurLong!'

sudo cp /var/lib/samba/private/krb5.conf /etc/krb5.conf
sudo systemctl enable --now samba-ad-dc
```

`--use-rfc2307` ajoute les attributs Unix (`uidNumber`, `gidNumber`) exploitables par `idmap_ad` et SSSD.

```smb /etc/samba/smb.conf (généré, extrait)
[global]
   netbios name = DC1
   realm = CORP.EXEMPLE.FR
   server role = active directory domain controller
   workgroup = CORP
   dns forwarder = 10.0.10.53          # résolveur pour les noms externes
   idmap_ldb:use rfc2307 = yes
   ldap server require strong auth = yes

[sysvol]
   path = /var/lib/samba/sysvol
   read only = No

[netlogon]
   path = /var/lib/samba/sysvol/corp.exemple.fr/scripts
   read only = No
```

| Backend DNS | Remarque |
| --- | --- |
| `SAMBA_INTERNAL` | Intégré, simple, suffisant dans la plupart des cas |
| `BIND9_DLZ` | Zones AD servies par BIND9 via un module (vues, fonctions avancées) — voir [[01-bind9/01-presentation\|BIND9]] |

Le DC doit se résoudre lui-même : `/etc/resolv.conf` → `nameserver 10.0.10.11`, `search corp.exemple.fr`.

## Vérifications

```bash
host -t SRV _ldap._tcp.corp.exemple.fr
host -t SRV _kerberos._udp.corp.exemple.fr
host -t A dc1.corp.exemple.fr
kinit administrator && klist
smbclient //localhost/netlogon -U administrator -c 'ls'
sudo samba-tool dbcheck --cross-ncs
```

## Heure signée pour les postes Windows

```text /etc/chrony/chrony.conf (extrait)
server 0.fr.pool.ntp.org iburst
allow 10.0.0.0/8
ntpsigndsocket /var/lib/samba/ntp_signd
```

```bash
sudo chgrp _chrony /var/lib/samba/ntp_signd && sudo chmod 750 /var/lib/samba/ntp_signd
sudo systemctl restart chrony
```

## Gestion courante

```bash
sudo samba-tool user create alice --given-name=Alice --surname=Martin --mail-address=alice@exemple.fr
sudo samba-tool user setpassword alice
sudo samba-tool user disable alice
sudo samba-tool group add GG_Compta_RW --group-scope=Global
sudo samba-tool group addmembers GG_Compta_RW alice
sudo samba-tool ou create "OU=Serveurs,DC=corp,DC=exemple,DC=fr"
sudo samba-tool computer list
sudo samba-tool domain passwordsettings set --complexity=on --min-pwd-length=12 --max-pwd-age=0
sudo samba-tool domain passwordsettings pso create PSO-Admins 10 --min-pwd-length=16   # stratégie affinée
sudo samba-tool gpo listall
sudo samba-tool dns add dc1 corp.exemple.fr srv-app A 10.0.20.15 -U administrator
```

Les consoles **RSAT** (Utilisateurs et ordinateurs AD, DNS, Gestion des stratégies de groupe) fonctionnent depuis un poste Windows joint au domaine. Les GPO se gèrent donc comme dans [[01-active-directory/05-gpo|un domaine Windows]].

## DC supplémentaire

```bash
# Sur dc2 (mêmes prérequis, DNS pointant vers dc1 pendant la jonction)
sudo samba-tool domain join corp.exemple.fr DC -U "CORP\administrator" --dns-backend=SAMBA_INTERNAL
sudo systemctl enable --now samba-ad-dc
sudo samba-tool drs showrepl                 # état de la réplication entrante/sortante
sudo samba-tool drs replicate dc2 dc1 dc=corp,dc=exemple,dc=fr
```

### SYSVOL

Samba ne réplique pas SYSVOL : synchronisez-le depuis le DC détenteur du rôle **PDC émulateur** (où l'on édite les GPO) vers les autres DC, par exemple avec `rsync` (+ `--xattrs --acls`) planifié, puis `samba-tool ntacl sysvolreset` si nécessaire.

```bash
sudo samba-tool ntacl sysvolcheck
sudo samba-tool ntacl sysvolreset
```

### Rôles FSMO

```bash
sudo samba-tool fsmo show
sudo samba-tool fsmo transfer --role=all -U administrator      # transfert propre
sudo samba-tool fsmo seize --role=pdc -U administrator         # prise forcée (DC d'origine définitivement perdu)
```

## Sauvegarde et restauration

```bash
sudo samba-tool domain backup online --targetdir=/srv/sauvegardes/ad --server=dc1 -U administrator
sudo samba-tool domain backup offline --targetdir=/srv/sauvegardes/ad        # sur le DC, service arrêté ou non
# Restauration (nouveau DC, reconstruction du domaine après sinistre) :
sudo samba-tool domain backup restore --backup-file=samba-backup-….tar.bz2 \
    --newservername=dc-restaure --targetdir=/var/lib/samba-restaure
```

Comme pour Windows, privilégiez la **réplication** (plusieurs DC) pour la disponibilité, et les sauvegardes pour la reprise après sinistre — voir [[01-active-directory/08-sauvegarde-restauration|sauvegarde AD]].

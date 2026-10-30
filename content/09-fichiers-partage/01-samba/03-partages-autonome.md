---
title: "Serveur autonome : partages et utilisateurs"
description: Configurer un serveur Samba autonome — section [global], comptes Samba (smbpasswd, pdbedit), partages par groupe avec droits de lecture/écriture, masques de création, partages [homes], partage public en lecture seule, accès invité et ses limites sous Windows 11, énumération basée sur l'accès.
tags: [samba, smb.conf, partages, smbpasswd, pdbedit, homes, invité]
icon: folder-open
---

## Configuration globale

```smb /etc/samba/smb.conf
[global]
   workgroup = EXEMPLE
   server string = Serveur de fichiers %h
   server role = standalone server
   passdb backend = tdbsam
   map to guest = never

   # Protocole et sécurité (voir l'article Sécurité)
   server min protocol = SMB2_10
   server signing = mandatory
   disable netbios = yes
   smb ports = 445

   # Pas d'impression
   load printers = no
   printing = bsd
   printcap name = /dev/null
   disable spoolss = yes

   # Journaux : un fichier par machine cliente
   log file = /var/log/samba/log.%m
   max log size = 10000
   log level = 1
```

## Utilisateurs et groupes

Un compte Samba s'appuie sur un compte **Unix** existant (UID, droits sur les fichiers) avec un mot de passe SMB distinct.

```bash
sudo groupadd compta
sudo useradd -M -s /usr/sbin/nologin -G compta alice     # sans dossier personnel ni shell
sudo smbpasswd -a alice                                   # mot de passe SMB
sudo smbpasswd -d alice                                   # désactiver (-e : réactiver)
sudo pdbedit -L -v                                        # lister les comptes Samba
sudo pdbedit -P "min password length" -C 12               # politique de mot de passe
sudo smbpasswd -x alice                                   # supprimer le compte Samba
```

## Partage par groupe

```bash
sudo mkdir -p /srv/samba/compta
sudo chown root:compta /srv/samba/compta
sudo chmod 2770 /srv/samba/compta                         # setgid : les fichiers héritent du groupe
```

```smb
[compta]
   comment = Comptabilité
   path = /srv/samba/compta
   read only = no
   valid users = @compta, @direction
   read list = @direction
   write list = @compta
   force group = compta
   create mask = 0660
   directory mask = 2770
   veto files = /*.exe/*.bat/*.ps1/
   delete veto files = yes
```

| Paramètre | Effet |
| --- | --- |
| `valid users` / `invalid users` | Qui peut se connecter au partage (`@groupe`, `+groupe` Unix) |
| `read only = no` + `read list` | Écriture autorisée, sauf pour la liste en lecture seule |
| `write list` | Écriture même si le partage est en lecture seule |
| `force group` / `force user` | Les fichiers créés appartiennent à ce groupe / cet utilisateur |
| `create mask` / `directory mask` | Droits **maximaux** des nouveaux fichiers / dossiers |
| `force create mode` / `force directory mode` | Droits **toujours ajoutés** |
| `veto files` | Noms interdits (masqués et non créables) |
| `browseable = no` | Partage masqué dans la liste (accessible si on connaît le nom) |
| `admin users` | Utilisateurs traités comme root sur ce partage : à proscrire |

> [!IMPORTANT]
> Samba ne fait **qu'ajouter** des restrictions : les droits du système de fichiers (propriétaire, groupe, ACL POSIX) s'appliquent toujours. Un utilisateur autorisé par `write list` mais sans droit d'écriture Unix sur le dossier ne pourra pas écrire.

## Dossiers personnels

```smb
[homes]
   comment = Dossier personnel
   browseable = no
   read only = no
   valid users = %S
   create mask = 0600
   directory mask = 0700
```

`%S` désigne le nom du partage, ici le nom de l'utilisateur : chacun ne voit que `\\serveur\<son nom>`. Le dossier Unix doit exister (`useradd -m`, ou `pam_mkhomedir` en domaine).

## Partage public en lecture seule

```smb
[logiciels]
   path = /srv/samba/logiciels
   read only = yes
   valid users = @utilisateurs
   write list = @admins-fichiers
```

## Accès invité : à éviter

```smb
[global]
   map to guest = Bad User
[depot]
   path = /srv/samba/depot
   guest ok = yes
   read only = yes
```

> [!WARNING]
> Windows 10/11 Entreprise et Éducation, puis **Windows 11 24H2** (toutes éditions) **bloquent l'accès invité non authentifié** et exigent la signature SMB : les partages invités deviennent inaccessibles. Préférez un compte en lecture seule partagé ou l'authentification par domaine. Assouplir ces stratégies côté Windows affaiblit les postes.

## Énumération basée sur l'accès

```smb
[global]
   access based share enum = yes     # masquer les partages auxquels l'utilisateur n'a pas accès
[projets]
   path = /srv/samba/projets
   hide unreadable = yes             # masquer fichiers et dossiers illisibles (équivalent ABE Windows)
```

## Appliquer et tester

```bash
testparm -s
sudo smbcontrol all reload-config
smbclient //localhost/compta -U alice -c 'ls; mkdir test; rmdir test'
```

Les nouvelles connexions prennent la configuration rechargée ; les sessions existantes gardent certains paramètres jusqu'à reconnexion.

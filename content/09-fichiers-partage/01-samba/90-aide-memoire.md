---
title: Samba — aide-mémoire des commandes
description: Commandes Samba avec exemples — vérification (testparm), service smbd/nmbd/winbind, utilisateurs Samba (smbpasswd, pdbedit), partages et droits, clients (smbclient, mount.cifs, smbstatus), intégration Active Directory (net ads join, wbinfo, getent), contrôleur de domaine Samba AD (samba-tool : domaine, utilisateurs, groupes, DNS, GPO, réplication, niveaux, FSMO), ACL NTFS (smbcacls), journaux.
tags: [aide-mémoire, samba, smb, cifs, samba-tool, winbind, smbclient]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|Samba]].

## Service et configuration

```bash
testparm                                  # vérifier smb.conf (Entrée pour afficher le résumé)
testparm -s --section-name=partage        # une section
sudo systemctl restart smbd nmbd          # serveur de fichiers autonome
sudo smbcontrol all reload-config         # relire sans redémarrer
smbd -V
```

```ini
# /etc/samba/smb.conf (extrait)
[global]
   server min protocol = SMB2_10
   smb encrypt = desired
   map to guest = never
   restrict anonymous = 2
[partage]
   path = /srv/partage
   valid users = @equipe-reseau
   read only = no
   create mask = 0660
   directory mask = 2770
   vfs objects = recycle
   recycle:repository = .corbeille/%U
```

## Utilisateurs locaux Samba

```bash
sudo smbpasswd -a amartin                # ajouter (le compte Unix doit exister)
sudo smbpasswd -x bpetit                 # supprimer
sudo smbpasswd -d amartin / -e amartin   # désactiver / activer
sudo pdbedit -L -v | head -20            # lister
```

## Clients

```bash
smbclient -L //nas.exemple.fr -U amartin
smbclient //nas.exemple.fr/partage -U amartin -c 'ls; get rapport.pdf'
sudo mount -t cifs //nas.exemple.fr/partage /mnt/partage -o username=amartin,domain=CORP,vers=3.1.1,seal,uid=1000,gid=1000
sudo mount -t cifs //nas.exemple.fr/partage /mnt/partage -o credentials=/root/.smb-cred,vers=3.1.1    # fichier username=/password=/domain=
sudo smbstatus                           # connexions et fichiers ouverts
sudo smbstatus -L                        # verrous
```

```powershell
# Windows
net use Z: \\nas.exemple.fr\partage /persistent:yes
Get-SmbConnection
New-SmbMapping -LocalPath Z: -RemotePath \\nas.exemple.fr\partage -Persistent $true
```

## Membre d'un domaine Active Directory

```bash
sudo net ads join -U admin-jdupont
sudo net ads testjoin
sudo net ads info
sudo systemctl restart winbind
wbinfo -t                                # secret de machine valide
wbinfo -u | head                         # utilisateurs du domaine
wbinfo -g | head
getent passwd 'CORP\amartin'
id 'CORP\amartin'
sudo net ads keytab create
```

## Contrôleur de domaine Samba AD (samba-tool)

```bash
sudo samba-tool domain provision --use-rfc2307 --realm=CORP.EXEMPLE.FR --domain=CORP --server-role=dc --dns-backend=SAMBA_INTERNAL --adminpass='MotDePasseAdmin'
sudo samba-tool domain level show
sudo samba-tool domain passwordsettings show
sudo samba-tool user create amartin --given-name=Alice --surname=Martin --mail-address=alice.martin@exemple.fr
sudo samba-tool user setpassword amartin
sudo samba-tool user disable bpetit
sudo samba-tool user list
sudo samba-tool group addmembers "Domain Admins" amartin
sudo samba-tool group listmembers "Domain Admins"
sudo samba-tool dns add 127.0.0.1 corp.exemple.fr www A 10.0.30.10 -U administrator
sudo samba-tool dns query 127.0.0.1 corp.exemple.fr @ ALL -U administrator
sudo samba-tool drs showrepl
sudo samba-tool fsmo show
sudo samba-tool gpo listall
sudo samba-tool dbcheck --cross-ncs
sudo samba-tool domain backup online --targetdir=/srv/sauvegardes --server=dc01 -U administrator
```

## ACL et droits

```bash
smbcacls //nas.exemple.fr/partage dossier -U amartin                          # afficher l'ACL Windows
smbcacls //nas.exemple.fr/partage dossier -U administrateur -a "ACL:CORP\\equipe-reseau:ALLOWED/OI|CI/CHANGE"
getfacl /srv/partage && sudo setfacl -m g:equipe-reseau:rwx /srv/partage
```

## Journaux

```bash
sudo tail -f /var/log/samba/log.smbd
sudo smbcontrol smbd debug 3              # augmenter temporairement le niveau
```

---
title: UrBackup — aide-mémoire des commandes
description: Commandes UrBackup avec exemples — serveur (service, interface web 55414, ports 55413-55415, emplacement des sauvegardes, Docker), client Linux (urbackupclientctl : status, start full/incrémental fichier et image, list, restore, add/remove des dossiers), client Windows (installation silencieuse, urbackupclient_cmd), nettoyage et vérification du serveur, journaux.
tags: [aide-mémoire, urbackup, sauvegarde, images, client, serveur]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|UrBackup]].

## Serveur

```bash
sudo systemctl status urbackupsrv
sudo urbackupsrv cleanup --amount 20%            # libérer 20 % de l'espace (anciennes sauvegardes)
sudo urbackupsrv remove-unknown                  # supprimer les fichiers inconnus de la base
sudo urbackupsrv repair-database
sudo tail -f /var/log/urbackup.log
docker run -d --name urbackup --network host -v /srv/urbackup/sauvegardes:/backups -v /srv/urbackup/base:/var/urbackup uroni/urbackup-server
```

Interface web : `http://<serveur>:55414` (créer immédiatement un compte administrateur). Ports : 55413-55415 (TCP) et 35623 (UDP, découverte sur le LAN) ; Internet : 55414-55415 via le mode « Internet client ».

## Client Linux

```bash
sudo urbackupclientctl status
sudo urbackupclientctl add-backupdir --path /etc --name etc
sudo urbackupclientctl add-backupdir --path /var/www --name web
sudo urbackupclientctl list-backupdirs
sudo urbackupclientctl remove-backupdir --path /var/www
sudo urbackupclientctl start -i                 # sauvegarde de fichiers incrémentale
sudo urbackupclientctl start -f                 # complète
sudo urbackupclientctl browse                   # sauvegardes disponibles
sudo urbackupclientctl restore-start -b last -d etc/nginx            # restauration à l'emplacement d'origine
sudo urbackupclientctl set-settings -k internet_server -v sauvegarde.exemple.fr
```

## Client Windows

```powershell
.\UrBackup_Client_2.5.x.exe /S                   # installation silencieuse
& "C:\Program Files\UrBackup\UrBackupClient_cmd.exe" status
& "C:\Program Files\UrBackup\UrBackupClient_cmd.exe" start -f
& "C:\Program Files\UrBackup\UrBackupClient_cmd.exe" add-backupdir --path "D:\Donnees" --name donnees
Get-Service UrBackupClientBackend
```

## Bonnes pratiques

- Restauration d'images complètes par le **CD/clé de restauration** UrBackup (démarrage réseau sur le serveur).
- Système de fichiers du serveur : btrfs ou ZFS recommandés (instantanés, déduplication efficace).
- Tester régulièrement une restauration de fichiers et une restauration d'image.

---
title: Rclone
description: Rclone — « rsync pour le cloud » (MIT) : plus de 70 stockages (S3 et compatibles, Azure Blob, Google Drive, OneDrive et SharePoint, Dropbox, SFTP, WebDAV, SMB, Backblaze B2, Swift), installation (Linux, macOS, Windows, Docker), rclone config, commandes copy, sync, move, check, bisync, montage (mount avec FUSE ou WinFsp, cache VFS), chiffrement (crypt), copie serveur à serveur, filtres, limitation de bande passante, serveur (rclone serve S3, WebDAV, SFTP), interface web et planification.
tags: [rclone, cloud, s3, synchronisation, onedrive, sharepoint, chiffrement]
icon: info
---

**Rclone** copie et synchronise des fichiers entre stockages locaux et **cloud** : migrer un partage vers SharePoint, sauvegarder vers un bucket S3 chiffré, monter Google Drive comme un disque, ou transférer entre deux clouds sans passer par le disque local.

## Installation

| Système | Commande |
| --- | --- |
| Linux, macOS | `sudo -v ; curl https://rclone.org/install.sh \| sudo bash` (ou paquet de la distribution, souvent plus ancien) |
| Windows | `winget install Rclone.Rclone` + **WinFsp** pour `rclone mount` |
| macOS | `brew install rclone` (montage : macFUSE ou `rclone nfsmount`) |
| Docker | `rclone/rclone` |

## Configuration

```bash
rclone config                       # assistant interactif : nouveau « remote » (s3, onedrive, drive, sftp…)
rclone config show ; rclone listremotes
```

```ini
# ~/.config/rclone/rclone.conf (Windows : %APPDATA%\rclone\rclone.conf)
[minio]
type = s3
provider = Minio
access_key_id = SAUVACCES
secret_access_key = SecretSauv2026
endpoint = https://minio.corp.exemple.fr

[minio-chiffre]
type = crypt
remote = minio:sauvegardes/serveurs
password = <généré par rclone config>
```

Protéger le fichier de configuration (droits `600`, ou chiffrement de la configuration par mot de passe).

## Commandes courantes

```bash
rclone lsd minio: ; rclone ls minio:sauvegardes | head ; rclone size minio:sauvegardes
rclone copy /srv/exports minio:sauvegardes/exports --progress --transfers 8
rclone sync /srv/donnees minio-chiffre: --dry-run          # puis sans --dry-run (sync supprime à la destination)
rclone sync /srv/donnees minio-chiffre: --backup-dir minio-chiffre:../archives/$(date +%F)   # garder les versions remplacées
rclone check /srv/donnees minio-chiffre:
rclone copy onedrive-ancien:Documents sharepoint-nouveau:Documents --progress   # cloud à cloud
rclone mount minio:sauvegardes /mnt/minio --vfs-cache-mode writes --daemon
rclone serve webdav /srv/partage --addr :8080 --user jk --pass "$MDP"
rclone rcd --rc-web-gui --rc-user admin --rc-pass "$MDP"   # interface web d'administration
```

<!-- CAPTURE: Rclone Web GUI — explorateur de remotes | _assets/rclone-webgui.png -->

Planification : minuterie systemd ou cron ; sous Windows, tâche planifiée avec `--log-file`. Commandes : [[90-aide-memoire|aide-mémoire]].

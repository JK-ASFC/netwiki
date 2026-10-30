---
title: Présentation, installation et utilisation
description: BorgBackup — sauvegarde dédupliquée, compressée et chiffrée (dépôts, archives, modes de chiffrement repokey et keyfile, export de la clé), installation sous Linux et macOS (Windows via WSL), serveur de sauvegarde SSH avec borg serve restreint et ajout seul, création d'archives, liste, extraction, montage et état de Borg 2.
tags: [borgbackup, borg, sauvegarde, déduplication, chiffrement, ssh, append-only]
icon: info
---

**BorgBackup** (BSD 3, Python + C) sauvegarde des fichiers dans un **dépôt** dédupliqué, compressé (lz4, zstd) et chiffré, localement ou sur un serveur distant **par SSH**. Très efficace pour les serveurs Linux, il est aussi le moteur de la sauvegarde intégrée de **Nextcloud AIO** et de services hébergés (BorgBase, Hetzner Storage Box).

| Notion | Description |
| --- | --- |
| Dépôt | Répertoire contenant les segments de données |
| Archive | Une sauvegarde (nom libre, ex. `srv-web-01-2026-10-29T01:30`) |
| Déduplication | Par blocs, entre toutes les archives du dépôt |
| `repokey` | Clé stockée **dans le dépôt**, protégée par la phrase de passe |
| `keyfile` | Clé stockée **chez le client** (`~/.config/borg/keys/`) : le dépôt seul ne suffit pas |

> [!WARNING]
> Exportez la clé (`borg key export`) et conservez-la avec la phrase de passe **hors du serveur** : sans elles, les sauvegardes sont illisibles.

## Installation

```bash
sudo apt install borgbackup        # Debian / Ubuntu ; dnf install borgbackup (EPEL / Fedora)
brew install borgbackup            # macOS (macFUSE pour borg mount)
borg --version
```

Pas de version Windows native : utilisez WSL, ou un autre outil ([[01-restic/01-presentation-installation|restic]]) pour les serveurs Windows.

## Serveur de sauvegarde SSH

Sur le serveur de sauvegarde, un compte dédié avec une clé SSH **restreinte** par client :

```text /home/borg/.ssh/authorized_keys
command="borg serve --restrict-to-path /srv/borg/srv-web-01 --append-only",restrict ssh-ed25519 AAAA… root@srv-web-01
command="borg serve --restrict-to-path /srv/borg/srv-db-01 --append-only",restrict ssh-ed25519 AAAA… root@srv-db-01
```

| Option | Effet |
| --- | --- |
| `command="borg serve …"` | La clé ne permet **que** Borg, pas de shell |
| `--restrict-to-path` | Le client n'accède qu'à son dépôt |
| `--append-only` | Le client ne peut pas supprimer d'archives (protection contre un client compromis) ; la purge se fait côté serveur |
| `restrict` | Pas de redirection de ports, d'agent, de X11, de PTY |

## Initialiser et sauvegarder

```bash
export BORG_REPO='ssh://borg@srv-sav-01.corp.exemple.fr/srv/borg/srv-web-01'
export BORG_PASSCOMMAND='cat /root/.borg-phrase'          # droits 0600

borg init --encryption=repokey-blake2
borg key export "$BORG_REPO" /root/borg-cle-srv-web-01.txt   # à mettre au coffre, puis supprimer localement

borg create --stats --progress --compression zstd,6 --exclude-caches \
  --exclude '/srv/www/*/cache' --exclude '*.tmp' \
  ::'{hostname}-{now:%Y-%m-%dT%H:%M}' /etc /srv/www /var/backups/sql
```

## Consulter et restaurer

```bash
borg list                                          # archives
borg list ::srv-web-01-2026-10-29T01:30 etc/nginx  # contenu
borg info ::srv-web-01-2026-10-29T01:30
borg diff ::srv-web-01-2026-10-28T01:30 srv-web-01-2026-10-29T01:30
cd /tmp/restauration && borg extract ::srv-web-01-2026-10-29T01:30 etc/nginx    # extrait dans le répertoire courant
borg mount :: /mnt/borg && ls /mnt/borg            # toutes les archives en lecture seule
borg umount /mnt/borg
```

## Borg 2

**Borg 2** (en cours de stabilisation) change le format des dépôts (non compatible avec Borg 1.x : transfert par `borg transfer`), la syntaxe (`borg repo-create`, `-r` pour le dépôt, archives par nom + identifiant) et ajoute des backends (sftp, rclone, S3). Les exemples de cette page utilisent **Borg 1.4**, la version de production.

Suite : [[02-borgmatic-exploitation|automatisation avec borgmatic et exploitation]].

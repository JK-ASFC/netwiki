---
title: restic — aide-mémoire des commandes
description: Commandes restic avec exemples — dépôts (local, SFTP, S3, rest-server, rclone), variables d'environnement, init, backup (exclusions, étiquettes, stdin), snapshots, ls, find, diff, restore (cible, include), mount, forget et prune (politique de rétention), check (--read-data-subset), clés, copy, stats, unlock, planification (systemd timer), Windows.
tags: [aide-mémoire, restic, sauvegarde, s3, rétention, chiffrement]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|restic]].

## Dépôt et environnement

```bash
export RESTIC_REPOSITORY="s3:https://minio.exemple.fr/sauvegardes/srv-web01"
export RESTIC_PASSWORD_FILE=/root/.restic-mdp
export AWS_ACCESS_KEY_ID=sauvegarde AWS_SECRET_ACCESS_KEY="$SECRET"
# Autres formes : /srv/depot-restic, sftp:sauvegarde@nas:/restic/srv-web01, rest:https://restic.exemple.fr/srv-web01, rclone:distant:restic
restic init
restic cat config
```

## Sauvegarder

```bash
restic backup /etc /var/www /home --exclude-file=/etc/restic/exclusions.txt --tag quotidien
restic backup /srv/donnees --exclude="*.tmp" --exclude-caches --one-file-system
mysqldump --single-transaction --all-databases | restic backup --stdin --stdin-filename mariadb.sql --tag base
restic backup /etc --dry-run -vv
```

## Consulter et restaurer

```bash
restic snapshots
restic snapshots --tag base --latest 3
restic ls latest /etc/nginx
restic find "*.conf" --path /etc
restic diff 1a2b3c4d 5e6f7a8b
restic restore latest --target /tmp/restauration --include /etc/nginx
restic restore 1a2b3c4d --target / --include /var/www/site/index.html
restic dump latest /etc/nginx/nginx.conf > nginx.conf.restaure
restic mount /mnt/restic &                # parcourir les sauvegardes comme un système de fichiers (FUSE)
```

## Rétention et vérification

```bash
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --keep-yearly 2 --prune
restic forget --tag base --keep-last 14 --prune
restic check
restic check --read-data-subset=5%         # relire une partie des données (contrôle d'intégrité)
restic stats --mode raw-data
restic unlock                              # verrou orphelin après une interruption
```

## Clés et copie

```bash
restic key list
restic key add
restic key remove <id>
restic copy --from-repo /srv/depot-local --from-password-file /root/.restic-mdp-local latest   # vers le dépôt courant (copie hors site)
```

## Planification (systemd)

```ini
# /etc/systemd/system/restic.service
[Service]
Type=oneshot
EnvironmentFile=/etc/restic/env
ExecStart=/usr/bin/restic backup /etc /var/www --tag quotidien
ExecStartPost=/usr/bin/restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --prune

# /etc/systemd/system/restic.timer
[Timer]
OnCalendar=*-*-* 02:30
RandomizedDelaySec=30m
Persistent=true
[Install]
WantedBy=timers.target
```

```bash
sudo systemctl enable --now restic.timer && systemctl list-timers restic.timer
```

## Windows

```powershell
winget install restic.restic
$env:RESTIC_REPOSITORY = "s3:https://minio.exemple.fr/sauvegardes/pc-paris-042"
restic backup C:\Users\amartin\Documents --use-fs-snapshot      # cliché VSS (console administrateur)
```

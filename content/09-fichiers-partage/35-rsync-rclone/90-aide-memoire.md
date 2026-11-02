---
title: rsync et Rclone — aide-mémoire des commandes
description: Commandes rsync (-a, -v, -z, -h, -n, -P, --delete, --exclude, --include, --files-from, --link-dest, -e ssh, --checksum, --itemize-changes, --remove-source-files, rsync:// ) et Rclone (config, lsd, ls, lsf, size, copy, sync, move, check, bisync, delete, purge, mount, serve, dedupe, cleanup, about, --dry-run, --bwlimit, --transfers, --filter) avec exemples.
tags: [aide-mémoire, rsync, rclone]
icon: terminal
---

Explications : [[01-rsync|rsync]] · [[02-rclone|Rclone]].

## rsync

```bash
rsync -avhP src/ dest/ ; rsync -avhn --delete src/ dest/ ; rsync -avh --checksum src/ dest/
rsync -av --itemize-changes src/ dest/ | head ; rsync -av --files-from=liste.txt / dest/
rsync -av --include='*/' --include='*.conf' --exclude='*' /etc/ /sauv/etc-conf/
rsync -av --remove-source-files /srv/a-deplacer/ nas:/archives/
rsync -av -e "ssh -i ~/.ssh/cle" /srv/ user@hote:/dest/ ; rsync -av rsync://miroir/module/ /srv/copie/
```

## Rclone

```bash
rclone config ; rclone listremotes ; rclone about onedrive: ; rclone lsf minio:bucket --recursive | head
rclone copy src remote:dest -P ; rclone sync src remote:dest --dry-run ; rclone move src remote:dest --min-age 30d
rclone check src remote:dest ; rclone bisync ~/Documents onedrive:Documents --resync     # premier passage
rclone delete remote:dest --min-age 90d ; rclone purge remote:test ; rclone cleanup remote:
rclone dedupe --dedupe-mode newest drive:Partage ; rclone copy src remote:dest --bwlimit "08:00,5M 19:00,off"
rclone mount remote: /mnt/r --vfs-cache-mode full --daemon ; fusermount -u /mnt/r
rclone serve s3 /srv/donnees --addr :8333 ; rclone version --check
```

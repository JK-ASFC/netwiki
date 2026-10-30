---
title: BorgBackup — aide-mémoire des commandes
description: Commandes Borg avec exemples — dépôts locaux et distants (SSH, borg serve restreint), init avec chiffrement (repokey-blake2), create (exclusions, compression, statistiques), list, info, diff, extract, mount, prune et compact, check (--verify-data), key export/import, break-lock, variables (BORG_REPO, BORG_PASSCOMMAND), Borgmatic.
tags: [aide-mémoire, borg, borgbackup, borgmatic, sauvegarde, déduplication]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|BorgBackup]].

## Dépôt

```bash
export BORG_REPO="ssh://borg@nas.exemple.fr:22/./srv-web01"
export BORG_PASSCOMMAND="cat /root/.borg-phrase"
borg init --encryption=repokey-blake2
borg key export "$BORG_REPO" /root/borg-cle-srv-web01.txt     # à conserver hors du serveur !
borg info
```

```text
# ~borg/.ssh/authorized_keys sur le serveur de sauvegarde : accès limité au dépôt
command="borg serve --restrict-to-path /srv/borg/srv-web01 --append-only",restrict ssh-ed25519 AAAA... root@srv-web01
```

## Sauvegarder

```bash
borg create --stats --progress --compression zstd,6 --exclude-caches \
  --exclude '/var/cache/*' --exclude '*.tmp' \
  ::'{hostname}-{now:%Y-%m-%d_%H%M}' /etc /var/www /home
borg create --dry-run --list ::test /etc
```

## Consulter et restaurer

```bash
borg list
borg list ::srv-web01-2026-10-30_0230 | head
borg info ::srv-web01-2026-10-30_0230
borg diff ::srv-web01-2026-10-29_0230 srv-web01-2026-10-30_0230
cd /tmp/restauration && borg extract ::srv-web01-2026-10-30_0230 etc/nginx
borg extract --dry-run --list ::srv-web01-2026-10-30_0230 var/www
borg mount :: /mnt/borg && ls /mnt/borg && borg umount /mnt/borg
```

## Rétention, compactage, vérification

```bash
borg prune --list --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --glob-archives '{hostname}-*'
borg compact                            # libérer l'espace (Borg 1.2+)
borg check
borg check --verify-data                # relire et vérifier toutes les données (long)
borg break-lock                         # verrou orphelin
borg key import "$BORG_REPO" /root/borg-cle-srv-web01.txt
```

## Borgmatic

```yaml
# /etc/borgmatic/config.yaml
source_directories: [/etc, /var/www, /home]
repositories:
  - path: ssh://borg@nas.exemple.fr/./srv-web01
    label: nas
encryption_passcommand: cat /root/.borg-phrase
compression: zstd,6
keep_daily: 7
keep_weekly: 4
keep_monthly: 12
mariadb_databases:
  - name: all
checks:
  - name: repository
  - name: archives
    frequency: 2 weeks
```

```bash
sudo borgmatic --verbosity 1 --list --stats
sudo borgmatic list
sudo borgmatic extract --archive latest --path etc/nginx --destination /tmp/restauration
sudo borgmatic config validate
```

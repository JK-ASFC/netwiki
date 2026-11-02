---
title: Btrfs et XFS — aide-mémoire des commandes
description: Commandes Btrfs (filesystem show/usage/df/resize, subvolume list/create/delete/snapshot/set-default, send, receive, scrub, balance, device add/remove/stats, replace, property, check) et XFS (mkfs.xfs, xfs_info, xfs_growfs, xfs_repair, xfs_quota, xfs_fsr, xfsdump, xfsrestore, xfs_admin, xfs_db) avec exemples.
tags: [aide-mémoire, btrfs, xfs]
icon: terminal
---

Explications : [[01-btrfs|Btrfs]] · [[02-xfs|XFS]].

## Btrfs

```bash
btrfs filesystem show ; btrfs filesystem usage /srv/partage ; btrfs filesystem df /srv/partage ; btrfs filesystem resize +50G /srv/partage
btrfs subvolume list /srv/partage ; btrfs subvolume create /srv/partage/projet ; btrfs subvolume delete /srv/.instantanes/ancien
btrfs subvolume snapshot -r /srv/partage /srv/.instantanes/x ; btrfs send -p /srv/.instantanes/x /srv/.instantanes/y | btrfs receive /sauv
btrfs scrub start -B /srv/partage ; btrfs balance start -dusage=40 -musage=40 /srv/partage ; btrfs balance status /srv/partage
btrfs device add /dev/sdd /srv/partage ; btrfs device remove /dev/sdc /srv/partage ; btrfs device stats -z /srv/partage
btrfs property set /srv/partage/journaux compression zstd ; compsize /srv/partage
btrfs check --readonly /dev/sdb
```

## XFS

```bash
xfs_info /srv/donnees ; xfs_growfs /srv/donnees ; xfs_admin -l /dev/sdb ; xfs_admin -L nouveau /dev/sdb
xfs_repair -n /dev/sdb ; xfs_repair /dev/sdb ; xfs_db -r -c frag /dev/sdb ; xfs_fsr -v /srv/donnees
xfs_quota -x -c 'report -h' /srv/donnees ; xfs_quota -x -c 'limit bsoft=90g bhard=100g jk' /srv/donnees
xfsdump -l 0 -L complet -M sauv -f /sauv/x.dump /srv/donnees ; xfsrestore -f /sauv/x.dump /srv/restaure
```

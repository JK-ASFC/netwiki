---
title: OpenZFS — aide-mémoire des commandes
description: Commandes zpool (create, status -x, list -v, iostat, scrub, replace, offline, online, clear, import, export, history, upgrade, trim, attach, detach) et zfs (create, list, get, set, inherit, snapshot, rollback, clone, promote, send, receive, destroy, diff, mount, load-key, userspace) avec exemples, et arcstat.
tags: [aide-mémoire, zfs, zpool, openzfs]
icon: terminal
---

Explications : [[01-presentation-installation|OpenZFS]].

```bash
zpool status -x ; zpool status -v tank ; zpool list -v ; zpool iostat -v tank 5 ; zpool history tank | tail
zpool scrub tank ; zpool scrub -s tank ; zpool trim tank ; zpool clear tank
zpool offline tank ata-DISQUE3 ; zpool replace tank ata-DISQUE3 ata-NOUVEAU ; zpool online tank ata-DISQUE3
zpool attach tank ata-A ata-B           # transformer un disque en miroir ; zpool detach tank ata-B
zpool export tank ; zpool import ; zpool import -d /dev/disk/by-id tank ; zpool upgrade tank
zfs list -t all -o name,used,refer,avail,mountpoint ; zfs get compression,compressratio,recordsize tank/bases
zfs set atime=off tank/bases ; zfs inherit compression tank/bases
zfs snapshot -r tank@avant-maj ; zfs rollback -r tank/bases@avant-maj ; zfs destroy tank/bases@ancien ; zfs destroy -nv tank@%2026-01  # simulation
zfs diff tank/bases@2026-11-01 tank/bases@2026-11-02 ; zfs clone tank/bases@x tank/test ; zfs promote tank/test
zfs send -Rw tank/confidentiel@x | ssh nas2 zfs receive sauv/confidentiel   # envoi brut chiffré
zfs load-key tank/confidentiel ; zfs mount -a ; zfs userspace tank/partage
arcstat 5 ; arc_summary | less
```

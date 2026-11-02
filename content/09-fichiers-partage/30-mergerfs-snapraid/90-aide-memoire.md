---
title: mergerfs et SnapRAID — aide-mémoire des commandes
description: Commandes mergerfs (montage, options, xattr de contrôle, mergerfs.balance, mergerfs.dedup) et SnapRAID (sync, scrub, status, diff, check, fix, list, smart, touch, up/down) avec exemples.
tags: [aide-mémoire, mergerfs, snapraid]
icon: terminal
---

Explications : [[01-presentation-installation|mergerfs et SnapRAID]].

```bash
mount | grep mergerfs ; df -h /srv/media
getfattr -n user.mergerfs.srcmounts /srv/media/.mergerfs
setfattr -n user.mergerfs.category.create -v epmfs /srv/media/.mergerfs     # changer la politique à chaud
mergerfs.balance /srv/media ; mergerfs.dedup /srv/media                      # paquet mergerfs-tools
snapraid status ; snapraid diff ; snapraid sync ; snapraid scrub -p 5
snapraid check -d d2 ; snapraid -d d2 fix ; snapraid -e fix                  # -e : seulement les blocs en erreur
snapraid list | head ; snapraid smart ; snapraid touch ; snapraid down
```

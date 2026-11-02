---
title: rdiff-backup et rsnapshot — aide-mémoire des commandes
description: Commandes rdiff-backup 2.x (backup, restore --at, list increments, list increment-sizes, list files --at, remove increments --older-than, verify, compare, regress, --exclude) et rsnapshot (configtest, -t, -v, du, diff, sync, niveaux de rétention) avec exemples.
tags: [aide-mémoire, rdiff-backup, rsnapshot]
icon: terminal
---

Explications : [[01-presentation-installation|rdiff-backup et rsnapshot]].

```bash
rdiff-backup --version ; rdiff-backup backup --exclude '**/cache' /srv /sauv/srv
rdiff-backup list increments /sauv/srv ; rdiff-backup list increment-sizes /sauv/srv ; rdiff-backup list files --at 2026-10-01 /sauv/srv | head
rdiff-backup restore --at 2026-10-01 /sauv/srv/www /tmp/www ; rdiff-backup verify /sauv/srv ; rdiff-backup compare /srv /sauv/srv
rdiff-backup remove increments --older-than 3M /sauv/srv ; rdiff-backup regress /sauv/srv     # après une sauvegarde interrompue
rsnapshot configtest ; rsnapshot -t quotidien ; rsnapshot -v quotidien ; rsnapshot du ; rsnapshot diff quotidien.0 quotidien.1
```

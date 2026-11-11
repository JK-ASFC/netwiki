---
title: Instantanés et sauvegarde du poste — aide-mémoire
description: Commandes Timeshift (create, list, restore, delete), Snapper (create-config, list, create, status, diff, undochange, rollback), Back In Time (backup, snapshots-list, restore) et Déjà Dup (backup, restore, restauration avec duplicity et restic).
tags: [aide-mémoire, timeshift, snapper, back in time, déjà dup, btrfs, sauvegarde]
icon: terminal
---

Explications : [[01-timeshift-snapper|Timeshift et Snapper]] · [[02-back-in-time-deja-dup|Back In Time et Déjà Dup]].

## Timeshift

```bash
sudo timeshift --list
sudo timeshift --create --comments "avant mise à niveau" --tags D
sudo timeshift --restore --snapshot '2026-11-11_10-00-01'
sudo timeshift --delete --snapshot '2026-11-11_10-00-01'
sudo timeshift --delete-all
cat /etc/timeshift/timeshift.json            # configuration
```

## Snapper

```bash
sudo snapper -c root create-config /
sudo snapper list ; sudo snapper list-configs
sudo snapper create -d "avant changement"
sudo snapper status 42..43 ; sudo snapper diff 42..43 /etc/fichier
sudo snapper undochange 42..43 /etc/fichier
sudo snapper delete 30-35
sudo snapper rollback 42                      # puis redémarrer
systemctl list-timers 'snapper-*'             # timeline et nettoyage
sudo btrfs filesystem usage /                 # place occupée
```

## Back In Time

```bash
backintime backup ; backintime --profile-id 2 backup
backintime snapshots-list
backintime restore /home/alice/fichier "" 20261111-100001-123
backintime check-config
```

## Déjà Dup et restauration directe

```bash
deja-dup --backup ; deja-dup --restore ~/Documents
duplicity restore file:///media/alice/Sauvegarde/poste ~/restauration
restic -r /media/alice/Sauvegarde/poste snapshots
restic -r /media/alice/Sauvegarde/poste restore latest --target ~/restauration
```

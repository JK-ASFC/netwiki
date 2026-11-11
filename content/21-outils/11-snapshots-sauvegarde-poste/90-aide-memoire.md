---
title: Aide-mémoire snapshots et sauvegarde du poste
description: Commandes prêtes à copier pour Timeshift, Snapper, Back In Time et Déjà Dup — créer, lister, restaurer et supprimer des snapshots ou sauvegardes sous Linux.
tags: [timeshift, snapper, back in time, deja dup, aide-mémoire]
icon: terminal
---

## Timeshift

```bash
sudo timeshift --list
sudo timeshift --create --comments "avant upgrade" --tags D
sudo timeshift --restore --snapshot '2026-11-09_10-00-01'
sudo timeshift --delete --snapshot '2026-11-09_10-00-01'
```

## Snapper

```bash
sudo snapper -c root create-config /
sudo snapper -c root create -d "avant upgrade"
sudo snapper -c root list
sudo snapper -c root status 1..2
sudo snapper -c root undochange 1..2 /etc/fstab
sudo snapper -c root delete 1
sudo systemctl enable --now snapper-timeline.timer snapper-cleanup.timer
```

## Back In Time

```bash
backintime backup
backintime --profile-id 2 backup
```

## Déjà Dup

```bash
flatpak install flathub org.gnome.DejaDup
deja-dup --backup
```

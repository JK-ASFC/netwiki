---
title: Snapper
description: Snapper, gestion des snapshots Btrfs, LVM et ext4 (openSUSE, Fedora, Arch, Debian) — création de configuration, snapshots timeline et pre/post, snapper list status diff undochange rollback, nettoyage automatique, YaST et Btrfs Assistant.
tags: [snapper, btrfs, snapshot, opensuse, rollback, lvm, linux]
icon: camera
---

**Snapper** (openSUSE) crée et gère des *snapshots* de systèmes de fichiers **Btrfs** (principalement) et de volumes **LVM à provisionnement léger**. Il liste les fichiers modifiés entre deux états, annule des changements fichier par fichier (`undochange`) ou revient à un état antérieur (`rollback`, Btrfs). C'est le mécanisme de retour arrière d'openSUSE ([[03-opensuse/01-presentation-installation|openSUSE]]). Alternative à l'approche rsync : [[01-timeshift|Timeshift]]. Voir [[28-btrfs-xfs/01-btrfs|Btrfs]].

## Installation

| Système | Commandes |
| --- | --- |
| openSUSE | Installé par défaut avec Btrfs ; `sudo zypper install snapper` |
| Debian / Ubuntu | `sudo apt install snapper` |
| Fedora / RHEL | `sudo dnf install snapper` |
| Arch | `sudo pacman -S snapper` |
| Windows, macOS, BSD, conteneur | Non pris en charge (nécessite Btrfs ou LVM sous Linux) |

## Configuration

```bash
sudo snapper -c root create-config /
sudo snapper -c home create-config /home
sudo snapper list-configs
sudo snapper -c root get-config
sudo snapper -c root set-config "NUMBER_CLEANUP=yes NUMBER_LIMIT=10"
```

Les configurations sont dans `/etc/snapper/configs/`. Activer la planification (unités fournies par le paquet) :

```bash
sudo systemctl enable --now snapper-timeline.timer snapper-cleanup.timer
```

Réglages courants : `TIMELINE_CREATE`, `TIMELINE_CLEANUP`, `TIMELINE_LIMIT_HOURLY`, `TIMELINE_LIMIT_DAILY`, `NUMBER_CLEANUP`, `NUMBER_LIMIT`, `ALLOW_USERS`.

## Utilisation

```bash
sudo snapper -c root list
sudo snapper -c root create -d "avant mise à jour"
sudo snapper -c root status 12..15
sudo snapper -c root diff 12..15 /etc/fstab
sudo snapper -c root undochange 12..15 /etc/fstab
sudo snapper -c root delete 12
sudo snapper -c root cleanup number
```

- Les options globales (`-c`, `--no-dbus`, `--jsonout`) se placent **avant** la commande.
- `status` et `diff` utilisent la syntaxe `numéro1..numéro2` ; le snapshot 0 est l'état courant.
- `create -t pre` puis `create -t post --pre-number N` encadrent une opération ; zypper le fait automatiquement sur openSUSE.
- `rollback` (Btrfs uniquement) crée deux snapshots et change le sous-volume par défaut : redémarrer ensuite.

## Interface graphique

Module **YaST Snapper** sur openSUSE, ou **Btrfs Assistant** (toutes distributions) : liste des snapshots, comparaison des fichiers modifiés, restauration de fichiers.

<!-- CAPTURE: Module Snapper de YaST, liste des snapshots | _assets/snapper-yast.png -->

## Dépannage

| Symptôme | Cause | Correction |
| --- | --- | --- |
| Disque plein | Rétention trop élevée | Réduire `NUMBER_LIMIT` et `TIMELINE_LIMIT_*`, puis `snapper cleanup all` |
| Utilisateur sans accès aux snapshots | Droits sur `.snapshots` | `chmod a+rx .snapshots` ou `setfacl -m u:alice:rx .snapshots` |
| `rollback` refusé | Système de fichiers non Btrfs | Utiliser `undochange` |

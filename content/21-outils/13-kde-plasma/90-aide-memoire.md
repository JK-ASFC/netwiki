---
title: Aide-mémoire KDE Plasma
description: Commandes prêtes à copier pour KDE Plasma 6 — installation, SDDM, kreadconfig6 et kwriteconfig6, redémarrage de plasmashell, journaux.
tags: [kde, plasma, aide-mémoire, kwriteconfig6, sddm]
icon: terminal
---

## Installation

```bash
sudo apt install kde-plasma-desktop
sudo dnf group install kde-desktop-environment
sudo zypper install -t pattern kde
sudo pacman -S plasma-meta
sudo pkg install kde
sudo systemctl enable --now sddm
```

## Configuration

```bash
kreadconfig6 --file kwinrc --group Desktops --key Number
kwriteconfig6 --file kwinrc --group Desktops --key Number 4
qdbus6 org.kde.KWin /KWin reconfigure
```

## Redémarrage et journaux

```bash
plasmashell --replace
kquitapp6 plasmashell
journalctl --user -b -u plasma-plasmashell
journalctl -b -u sddm
```

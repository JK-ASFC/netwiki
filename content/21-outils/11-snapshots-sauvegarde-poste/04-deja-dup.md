---
title: Déjà Dup
description: Déjà Dup (Sauvegardes GNOME) — sauvegarde simple des données personnelles sous Linux avec chiffrement, destinations locale, réseau et cloud, installation Flatpak, apt, dnf, pacman, restauration.
tags: [deja dup, sauvegarde, gnome, restic, duplicity, flatpak, linux]
icon: hard-drive-download
---

**Déjà Dup** (GPL-3.0-ou-ultérieure, projet GNOME) sauvegarde le poste de travail : choix des dossiers, destination, planification, **chiffrement par mot de passe**, restauration depuis l'interface. Il s'appuie sur un moteur externe (Restic dans les versions récentes, Duplicity historiquement). Voir aussi [[03-back-in-time|Back In Time]] et [[01-timeshift|Timeshift]] (système).

## Installation

| Système | Commandes |
| --- | --- |
| Tous Linux (recommandé) | `flatpak install flathub org.gnome.DejaDup` |
| Debian / Ubuntu | `sudo apt install deja-dup` |
| Fedora / RHEL | `sudo dnf install deja-dup` |
| Arch | `sudo pacman -S deja-dup` |
| openSUSE | `sudo zypper install deja-dup` |
| Windows, macOS, BSD | Non pris en charge |

## Interface graphique

Application *Sauvegardes* : **Dossiers à sauvegarder** (par défaut le dossier personnel), **Dossiers à ignorer**, **Emplacement de stockage** (dossier local, disque externe, serveur réseau, service en ligne), **Planification**, puis *Sauvegarder maintenant*. La restauration passe par l'onglet *Restaurer* en choisissant la date.

<!-- CAPTURE: Fenêtre Sauvegardes, vue d'ensemble | _assets/deja-dup-apercu.png -->
<!-- CAPTURE: Choix de l'emplacement de stockage | _assets/deja-dup-stockage.png -->

> [!WARNING]
> Conserver le mot de passe de chiffrement hors de la machine : sans lui, la sauvegarde est illisible.

## Ligne de commande et paramètres

```bash
deja-dup --backup
gsettings list-recursively org.gnome.DejaDup
```

## Dépannage

| Symptôme | Cause | Correction |
| --- | --- | --- |
| Aucune sauvegarde automatique | Disque ou réseau absent | Vérifier le montage ; lancer `deja-dup --backup` |
| Version Flatpak ne voit pas un dossier | Isolation Flatpak | `flatpak override --user --filesystem=/mnt/sauvegardes org.gnome.DejaDup` |

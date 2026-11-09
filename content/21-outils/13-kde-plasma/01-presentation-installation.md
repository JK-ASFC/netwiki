---
title: Présentation et installation
description: KDE Plasma 6, environnement de bureau libre — installation sur Debian, Ubuntu, Fedora, openSUSE, Arch et FreeBSD, gestionnaire de connexion SDDM, sessions Wayland et X11, applications KDE, alternatives GNOME et Xfce.
tags: [kde, plasma, bureau, wayland, x11, sddm, linux, freebsd]
icon: layout-dashboard
---

**KDE Plasma** est un environnement de bureau libre, très configurable : panneaux, widgets (*plasmoïdes*), activités, bureaux virtuels, lanceur, **KRunner** (recherche et commandes), **Discover** (logiciels : paquets de la distribution, Flatpak, Snap), **Paramètres système** et intégration de [[12-partage-appareils/01-kde-connect|KDE Connect]]. Plasma 6 repose sur Qt 6. Alternatives : GNOME, Xfce, Cinnamon (voir [[24-systemes-exploitation/03-opensuse/01-presentation-installation|openSUSE]] qui le propose en standard).

## Composants

| Composant | Rôle |
| --- | --- |
| `plasmashell` | Bureau, panneaux et widgets |
| `kwin` | Gestionnaire de fenêtres et compositeur (Wayland et X11) |
| `sddm` | Gestionnaire de connexion |
| `systemsettings` | Paramètres système |
| `krunner` | Lanceur et recherche |

Plasma propose deux sessions : **Plasma (Wayland)** et **Plasma (X11)**, choisies sur l'écran de connexion. Wayland est le choix courant ; X11 reste utile pour certains outils (capture ou partage d'écran, [[12-partage-appareils/02-barrier-input-leap-synergy|Barrier]]).

## Installation

| Système | Commandes |
| --- | --- |
| Debian / Ubuntu | `sudo apt install kde-plasma-desktop` (minimal) ou `kde-standard` ; Kubuntu pour une installation dédiée |
| Fedora | `sudo dnf group install kde-desktop-environment` ou l'édition Fedora KDE Plasma |
| RHEL / Rocky / Alma | Non fourni dans les dépôts de base ; passer par EPEL ou privilégier GNOME |
| openSUSE | `sudo zypper install -t pattern kde` |
| Arch | `sudo pacman -S plasma-meta kde-applications` puis `sudo systemctl enable --now sddm` |
| FreeBSD | `sudo pkg install kde` (complet) ou `plasma6-plasma` (minimal, ajouter `konsole`) |
| Windows | Non pris en charge ; outils KDE isolés disponibles |
| macOS | Non pris en charge |
| Conteneur | Non adapté (utiliser une VM) |

Activer le gestionnaire de connexion :

```bash
sudo systemctl enable --now sddm
```

FreeBSD (`/etc/rc.conf`) :

```bash
sudo sysrc dbus_enable="YES"
sudo sysrc sddm_enable="YES"
```

> [!NOTE]
> Sous FreeBSD, la session Wayland est expérimentale ; la session X11 reste la plus fiable. Un test sans SDDM : `exec dbus-launch --exit-with-x11 ck-launch-session startplasma-x11` dans `~/.xinitrc`, puis `startx`.

## Premiers pas

- `Alt+Espace` (ou `Alt+F2`) : KRunner.
- *Paramètres système* : apparence, bureaux virtuels, raccourcis, écrans, réseau.
- Clic droit sur le bureau ou le panneau → *Entrer en mode édition* pour ajouter des widgets.

Suite : [[02-configuration-exploitation|Configuration et exploitation]], [[03-interface-graphique|Interface graphique]], [[90-aide-memoire|Aide-mémoire]].

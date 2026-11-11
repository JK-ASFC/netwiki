---
title: Choisir un environnement de bureau Linux
description: Panorama des environnements de bureau Linux et BSD — GNOME, KDE Plasma, XFCE, MATE, Cinnamon, LXQt et COSMIC comparés (bibliothèque graphique, Wayland ou X11, ressources, cas d'usage), installation sur Debian, Ubuntu, Fedora et openSUSE, gestionnaires de connexion (GDM, SDDM, LightDM), choix de la session, Wayland face à X11 et bureau à distance.
tags: [bureau, gnome, kde plasma, xfce, mate, cinnamon, lxqt, cosmic, wayland, x11, gdm, sddm, lightdm]
icon: monitor
---

Un **environnement de bureau** regroupe le gestionnaire de fenêtres (ou compositeur), le panneau, le gestionnaire de fichiers, les réglages et les applications de base. Sur un serveur, on n'en installe généralement pas ; il sert sur les **postes d'administration**, les postes utilisateurs Linux, les machines de supervision ou les serveurs de bureau à distance.

## Comparatif

| Bureau | Bibliothèque | Session par défaut | Ressources | Points forts | Pour qui |
| --- | --- | --- | --- | --- | --- |
| **GNOME** | GTK 4 | **Wayland** (X11 abandonné par les versions récentes) | Moyennes à élevées | Épuré, cohérent, très intégré à Fedora et Ubuntu, réglages imposables par dconf | Postes d'entreprise, utilisateurs non techniques |
| **KDE Plasma** | Qt 6 | **Wayland** (X11 encore disponible) | Moyennes | Très personnalisable, applications riches (Dolphin, Konsole, Kate), Kiosk pour verrouiller | Utilisateurs avancés, administrateurs, postes Windows-like |
| **XFCE** | GTK 3 | X11 (Wayland en cours) | Faibles | Léger, stable, classique | Matériel ancien, VM, bureau à distance |
| **MATE** | GTK 3 | X11 | Faibles | Continuité de GNOME 2, très stable | Utilisateurs habitués à l'ancien GNOME, bureau à distance |
| **Cinnamon** | GTK 3 | X11 (Wayland expérimental) | Moyennes | Bureau de Linux Mint, disposition proche de Windows | Migrations depuis Windows |
| **LXQt** | Qt 6 | X11 et Wayland (compositeurs wlroots, KWin) | Très faibles | Le plus léger des bureaux complets | Vieux matériel, VM légères |
| **COSMIC** | Rust (libcosmic, iced) | **Wayland** uniquement | Moyennes | Pavage des fenêtres intégré, moderne, développé par System76 | Pop!_OS, utilisateurs qui aiment le pavage |

## Installer un bureau

```bash
# Debian : tâches tasksel
sudo apt install task-gnome-desktop      # ou task-kde-desktop, task-xfce-desktop, task-mate-desktop,
                                         #    task-cinnamon-desktop, task-lxqt-desktop
# Ubuntu : variantes officielles
sudo apt install kubuntu-desktop         # ou xubuntu-desktop, ubuntu-mate-desktop, lubuntu-desktop, ubuntucinnamon-desktop
# Fedora : groupes d'environnement (ou directement les « Spins » et Fedora KDE Plasma Desktop)
sudo dnf install @kde-desktop-environment      # ou @xfce-desktop-environment, @mate-desktop-environment,
                                               #    @cinnamon-desktop-environment, @lxqt-desktop-environment
# openSUSE
sudo zypper install -t pattern kde_plasma      # ou gnome, xfce, mate, lxqt
# COSMIC : Pop!_OS, paquets Fedora (@cosmic-desktop-environment) ou Arch (cosmic)
```

> [!TIP]
> Installer plusieurs bureaux sur le même poste mélange les applications et les réglages par défaut. Pour un poste de travail, choisissez **une variante de la distribution** déjà construite autour du bureau voulu (Kubuntu, Fedora KDE, Xubuntu, Linux Mint…).

Pour passer en mode graphique au démarrage après une installation minimale :

```bash
sudo systemctl set-default graphical.target
sudo systemctl isolate graphical.target     # immédiatement, sans redémarrer
```

## Gestionnaires de connexion

| Gestionnaire | Fourni avec | Commandes |
| --- | --- | --- |
| **GDM** | GNOME | `systemctl status gdm` (paquet `gdm3` sur Debian) |
| **SDDM** | KDE Plasma, LXQt | `systemctl status sddm` |
| **LightDM** | XFCE, MATE, Cinnamon | `systemctl status lightdm` |
| **cosmic-greeter** | COSMIC | `systemctl status cosmic-greeter` |

```bash
# Changer de gestionnaire de connexion (Debian/Ubuntu)
sudo dpkg-reconfigure gdm3                 # propose GDM, SDDM, LightDM installés
# Ailleurs : activer celui voulu
sudo systemctl disable gdm && sudo systemctl enable sddm --force
```

Le choix de la **session** (GNOME, Plasma Wayland, Plasma X11, XFCE…) se fait sur l'écran de connexion, généralement par une icône d'engrenage ou un menu en bas de l'écran.

## Wayland ou X11

| | Wayland | X11 (Xorg) |
| --- | --- | --- |
| Statut | Par défaut sur GNOME, Plasma, COSMIC | Héritage, encore utilisé par XFCE, MATE, Cinnamon |
| Sécurité | Une application ne peut pas lire l'écran ni le clavier des autres | Toute application voit tout |
| Partage d'écran, capture | Via les **portails** (PipeWire) : visioconférence et outils récents compatibles | Natif |
| Applications X11 | Fonctionnent via **XWayland** | Natives |
| Points de vigilance | Vieux outils de bureau à distance, partage clavier/souris, automatisation (xdotool) | — |

```bash
echo $XDG_SESSION_TYPE        # wayland ou x11
loginctl show-session "$XDG_SESSION_ID" -p Type
```

## Bureau à distance

| Bureau | Accès intégré | Autres solutions |
| --- | --- | --- |
| GNOME | **GNOME Remote Desktop** (RDP), à activer dans *Paramètres → Système → Bureau à distance* ou avec `grdctl` | xrdp, VNC |
| KDE Plasma | **KRDP** (RDP) dans les versions récentes de Plasma 6 | xrdp, VNC (krfb) |
| XFCE, MATE | — | **xrdp** (très utilisé : léger), X2Go, VNC |

Voir les pages du wiki sur xrdp, VNC, X2Go et Apache Guacamole (catégorie *Gestion de parc*).

Suite : [[02-gnome-kde-plasma|administrer GNOME et KDE Plasma]] · [[03-xfce-mate-cinnamon-lxqt-cosmic|XFCE, MATE, Cinnamon, LXQt et COSMIC]]. Commandes : [[90-aide-memoire|aide-mémoire]].

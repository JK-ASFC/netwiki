---
title: Équivalences entre gestionnaires de paquets
description: Tableau de correspondance des commandes apt (Debian, Ubuntu), dnf et yum (Fedora, RHEL, Rocky, Alma), zypper (openSUSE, SLES), pacman (Arch), apk (Alpine), emerge et Portage (Gentoo), Homebrew et Nix — rechercher, installer, supprimer, mettre à jour, lister, savoir quel paquet fournit un fichier, nettoyer le cache, verrouiller une version, avec renvoi vers chaque distribution.
tags: [apt, dnf, yum, zypper, pacman, apk, portage, emerge, paquets, linux]
icon: arrow-left-right
---

Détails par distribution : [[01-debian-ubuntu/01-presentation-installation|Debian et Ubuntu (apt)]] · [[02-famille-red-hat/01-presentation-installation|Red Hat, Rocky, Alma, Fedora (dnf, yum)]] · [[03-opensuse/01-presentation-installation|openSUSE (zypper)]] · [[04-arch-linux/01-presentation-installation|Arch Linux (pacman)]] · [[06-alpine-linux/01-presentation-installation|Alpine (apk)]] · [[05-gentoo/01-presentation-installation|Gentoo (Portage)]] · [[07-nixos/01-presentation-installation|NixOS]].

## Opérations courantes

| Action | apt | dnf (yum) | zypper | pacman | apk | emerge |
| --- | --- | --- | --- | --- | --- | --- |
| Rafraîchir les index | `apt update` | `dnf makecache` | `zypper refresh` | `pacman -Sy` | `apk update` | `emerge --sync` |
| Rechercher | `apt search nom` | `dnf search nom` | `zypper search nom` | `pacman -Ss nom` | `apk search nom` | `emerge --search nom` |
| Installer | `apt install nom` | `dnf install nom` | `zypper install nom` | `pacman -S nom` | `apk add nom` | `emerge nom` |
| Supprimer | `apt remove nom` (`purge`) | `dnf remove nom` | `zypper remove nom` | `pacman -Rns nom` | `apk del nom` | `emerge --depclean nom` |
| Tout mettre à jour | `apt full-upgrade` | `dnf upgrade` | `zypper update` (`dup` en Tumbleweed) | `pacman -Syu` | `apk upgrade` | `emerge -uDN @world` |
| Informations | `apt show nom` | `dnf info nom` | `zypper info nom` | `pacman -Si nom` | `apk info -a nom` | `equery meta nom` |
| Paquets installés | `apt list --installed` | `dnf list --installed` | `zypper search -i` | `pacman -Q` | `apk list -I` | `qlist -I` |
| Quel paquet fournit un fichier | `dpkg -S /chemin` | `dnf provides /chemin` | `zypper search --provides /chemin` | `pacman -Qo /chemin` | `apk info --who-owns /chemin` | `equery belongs /chemin` |
| Fichiers d'un paquet | `dpkg -L nom` | `rpm -ql nom` | `rpm -ql nom` | `pacman -Ql nom` | `apk info -L nom` | `equery files nom` |
| Dépendances inutiles | `apt autoremove` | `dnf autoremove` | `zypper packages --unneeded` | `pacman -Qdtq \| pacman -Rns -` | (automatique) | `emerge --depclean` |
| Vider le cache | `apt clean` | `dnf clean all` | `zypper clean` | `pacman -Sc` | `apk cache clean` | `eclean distfiles` |
| Bloquer une version | `apt-mark hold nom` | `dnf versionlock add nom` | `zypper addlock nom` | `IgnorePkg` dans `pacman.conf` | `apk add nom=1.2.3-r0` | `package.mask` |
| Historique | `/var/log/apt/history.log` | `dnf history` | `/var/log/zypp/history` | `/var/log/pacman.log` | — | `/var/log/emerge.log` |

`yum` reste disponible sur RHEL 8 et suivantes comme alias de `dnf` ; `dnf versionlock` nécessite le greffon (`dnf install 'dnf-command(versionlock)'`). Sous Gentoo, `equery` et `qlist` viennent de `app-portage/gentoolkit` et `app-portage/portage-utils`.

## Autres gestionnaires

| Action | Homebrew | Nix | Flatpak | Snap |
| --- | --- | --- | --- | --- |
| Installer | `brew install nom` | `nix profile add nixpkgs#nom` | `flatpak install flathub id` | `snap install nom` |
| Mettre à jour | `brew upgrade` | `nix profile upgrade --all` | `flatpak update` | `snap refresh` |
| Supprimer | `brew uninstall nom` | `nix profile remove nom` | `flatpak uninstall id` | `snap remove nom` |

Voir [[01-homebrew-macports|Homebrew]] · [[02-nix-guix|Nix et Guix]] · [[03-flatpak-snap-appimage|Flatpak, Snap, AppImage]]. Windows : [[01-outils-windows/01-terminal-gestionnaires-paquets|WinGet, Chocolatey, Scoop]].

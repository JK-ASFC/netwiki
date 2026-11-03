---
title: Flatpak, Snap et AppImage
description: Formats d'applications universels pour Linux — Flatpak (LGPL : dépôt Flathub, installation système ou utilisateur, bacs à sable et permissions, flatpak override, Flatseal, mises à jour, nettoyage), Snap (GPL, Canonical : snapd, confinement strict ou classic, canaux, mises à jour automatiques et fenêtre de rafraîchissement, revert, connexions d'interfaces) et AppImage (fichier unique portable, FUSE 2, extraction, intégration au bureau, mise à jour par zsync), comparaison, sécurité et usage sur un parc.
tags: [flatpak, snap, snapd, appimage, flathub, linux, applications]
icon: package-open
---

Ces formats embarquent l'application et ses bibliothèques : la **même** version fonctionne sur Debian, Fedora, Ubuntu ou Arch, indépendamment des paquets de la distribution.

| | Flatpak | Snap | AppImage |
| --- | --- | --- | --- |
| Usage principal | Applications de bureau | Bureau, serveur, IoT, outils en ligne de commande | Application portable unique |
| Dépôt | **Flathub** (et dépôts privés) | Snap Store (Canonical, centralisé) | Aucun (téléchargement direct) |
| Isolation | Bac à sable (bubblewrap) + portails | AppArmor (confinement strict) | Aucune |
| Mises à jour | `flatpak update` (ou logithèque) | **Automatiques** | Manuelles ou zsync |
| Distribution par défaut | Fedora, Linux Mint, … | Ubuntu | — |

## Flatpak

```bash
sudo apt install flatpak                    # Debian/Ubuntu ; Fedora : préinstallé
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak search keepassxc
flatpak install -y flathub org.keepassxc.KeePassXC          # installation système (tous les utilisateurs)
flatpak install --user flathub org.remmina.Remmina          # pour l'utilisateur seul
flatpak run org.keepassxc.KeePassXC
flatpak list --app ; flatpak update -y
flatpak uninstall --unused                  # retirer les environnements d'exécution orphelins
flatpak info --show-permissions org.keepassxc.KeePassXC
sudo flatpak override --nofilesystem=home org.exemple.App   # retirer l'accès au dossier personnel
```

L'application **Flatseal** modifie graphiquement les permissions. Les données des applications sont dans `~/.var/app/<identifiant>`.

## Snap

```bash
snap find nextcloud
sudo snap install btop
sudo snap install code --classic            # sans confinement (éditeurs, outils de développement)
sudo snap install lxd --channel=6/stable
snap list ; snap list --all                 # anciennes révisions conservées
sudo snap refresh ; sudo snap refresh --hold=72h firefox
sudo snap revert firefox                    # revenir à la révision précédente
snap connections firefox
sudo snap set system refresh.timer=sat,03:00-05:00          # fenêtre de mise à jour
sudo snap remove --purge btop
```

Sur Ubuntu Server, de nombreux outils (LXD, MicroK8s, certbot…) sont distribués en snap. Les machines sans accès à Internet passent par un **Enterprise Store** (proxy) de Canonical.

## AppImage

```bash
chmod +x Logiciel-1.2.3-x86_64.AppImage
./Logiciel-1.2.3-x86_64.AppImage
sudo apt install libfuse2t64                # Ubuntu 24.04+ (libfuse2 sur les versions antérieures)
./Logiciel-1.2.3-x86_64.AppImage --appimage-extract      # sans FUSE : dossier squashfs-root
```

Aucune isolation ni mise à jour centralisée : vérifier la provenance (signature, empreinte publiée par l'éditeur). Des outils comme **Gear Lever** ou AppImageLauncher ajoutent l'application au menu et gèrent les mises à jour.

## Sur un parc

- Préférer les paquets de la distribution pour les serveurs ; Flatpak ou Snap pour les applications de bureau récentes.
- Désactiver ou filtrer les dépôts (`flatpak remote-modify --disable flathub`) si seules des applications validées sont autorisées.
- Les solutions de gestion ([[06-support-parc/05-glpi-inventaire-assistance|GLPI]] avec agent, Ansible) peuvent inventorier et installer Flatpak et Snap (modules `community.general.flatpak`, `community.general.snap`).

Commandes : [[90-aide-memoire|aide-mémoire]].

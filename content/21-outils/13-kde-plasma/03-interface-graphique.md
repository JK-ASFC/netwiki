---
title: Interface graphique
description: Prise en main du bureau KDE Plasma 6 — lanceur, panneaux, widgets, Paramètres système, KRunner, Discover, activités et bureaux virtuels, avec l'équivalent en ligne de commande.
tags: [kde, plasma, interface graphique, panneau, widgets, krunner, discover]
icon: monitor
---

L'interface s'ouvre sur une session **Plasma (Wayland)** ou **Plasma (X11)** choisie depuis l'écran de connexion SDDM.

## Écrans principaux

| Élément | Usage | Équivalent CLI |
| --- | --- | --- |
| Lanceur d'applications | Applications, favoris, récents | `gtk-launch nom-application` (lance une application par son fichier `.desktop`) |
| Panneau (barre des tâches) | Applications, zone de notification, horloge | Modifier `plasma-org.kde.plasma.desktop-appletsrc` (voir [[02-configuration-exploitation\|Configuration]]) |
| Paramètres système | Apparence, périphériques, réseau, raccourcis | `systemsettings` |
| KRunner | Lancer, calculer, rechercher | `krunner` (Alt+Espace) |
| Discover | Installer et mettre à jour (paquets, Flatpak) | `flatpak install`, `sudo apt install`, etc. |
| Activités et bureaux virtuels | Organiser les espaces de travail | `kwriteconfig6 --file kwinrc --group Desktops --key Number 4` |

<!-- CAPTURE: Bureau Plasma 6 avec panneau et lanceur ouvert | _assets/plasma-bureau.png -->
<!-- CAPTURE: Paramètres système, page Apparence | _assets/plasma-parametres-systeme.png -->
<!-- CAPTURE: Mode édition du bureau avec le panneau de widgets | _assets/plasma-mode-edition.png -->
<!-- CAPTURE: Discover, page des mises à jour | _assets/plasma-discover.png -->

## Tâches courantes

1. **Ajouter un widget** : clic droit sur le bureau → *Entrer en mode édition* → *Ajouter des widgets*.
2. **Changer de thème** : *Paramètres système → Apparence → Thème global*.
3. **Configurer plusieurs écrans** : *Paramètres système → Affichage et moniteur*.
4. **Définir des raccourcis** : *Paramètres système → Raccourcis*.
5. **Associer un téléphone** : page *KDE Connect* des paramètres ([[12-partage-appareils/01-kde-connect|KDE Connect]]).

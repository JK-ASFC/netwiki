---
title: Interface graphique
description: Utiliser UTM à la souris — fenêtre principale et bibliothèque de machines, assistant de création, réglages d'une VM (système, QEMU, affichage, réseau, disques, partage), instantanés de disque, clonage, export, console et intégration (SPICE), équivalents utmctl.
tags: [utm, macos, interface graphique, virtualisation]
icon: app-window
---

## Fenêtre principale

Barre latérale : liste des machines (état, système) ; zone principale : aperçu, bouton **Lecture**, taille du disque, architecture. Boutons de la barre d'outils : **+** (créer), partager, réglages, cloner, supprimer.

<!-- CAPTURE: UTM — fenêtre principale avec une VM Windows 11 et une VM Debian | _assets/utm-fenetre-principale.png -->

## Assistant de création

*Virtualiser* ou *Émuler* → système → matériel (mémoire, cœurs, accélération 3D) → stockage (taille du disque) → dossier partagé → résumé (nom, *Ouvrir les réglages de la VM* pour affiner).

<!-- CAPTURE: UTM — assistant, choix Virtualiser / Émuler | _assets/utm-assistant-virtualiser.png -->
<!-- CAPTURE: UTM — assistant, étape Windows avec l'ISO ARM64 et l'option pilotes SPICE | _assets/utm-assistant-windows.png -->

## Réglages d'une machine

Clic droit sur la VM → **Modifier** (VM arrêtée) :

| Rubrique | Réglages |
| --- | --- |
| Informations | Nom, icône, notes |
| Système | Architecture, système, mémoire, cœurs, UEFI |
| QEMU | Accélération HVF, arguments QEMU supplémentaires, journal de débogage |
| Affichage | Carte (virtio-gpu, VirtIO-ramfb), résolution, redimensionnement automatique |
| Réseau | Partagé, ponté (interface), hôte uniquement, carte (virtio-net), **redirections de ports** |
| Disques / Lecteurs | Ajouter un disque, lecteur CD (ISO), ordre de démarrage |
| Partage | Dossier partagé (VirtFS ou WebDAV), presse-papiers |

<!-- CAPTURE: UTM — réglages Réseau avec mode ponté et redirection de port SSH | _assets/utm-reglages-reseau.png -->

## Utilisation courante

- **Console** : fenêtre de la VM ; barre d'outils (capturer la souris, clavier, lecteurs USB à connecter, dossier partagé, redimensionnement).
- **Cloner** : clic droit → *Cloner* (copie complète) ; *Ouvrir dans le Finder* montre le paquet `.utm` (configuration + disques qcow2).
- **Instantané** : UTM n'a pas de gestionnaire d'instantanés graphique ; copier le paquet `.utm` VM arrêtée ou utiliser `qemu-img snapshot` sur les disques.
- **Partager** : exporter le paquet `.utm` (zip) pour transmettre une machine prête.

<!-- CAPTURE: UTM — VM Debian en cours d'exécution avec la barre d'outils | _assets/utm-console-debian.png -->

## Correspondance avec utmctl

| Action | Interface | Commande |
| --- | --- | --- |
| Lister | Barre latérale | `utmctl list` |
| Démarrer / arrêter | Bouton Lecture / Arrêt | `utmctl start "Debian 13"` / `utmctl stop "Debian 13"` |
| Cloner | Clic droit → Cloner | `utmctl clone "Debian 13" --name "Debian 13 bis"` |
| Adresse IP | Informations de la VM | `utmctl ip-address "Debian 13"` |

Commandes : [[90-aide-memoire|aide-mémoire]].

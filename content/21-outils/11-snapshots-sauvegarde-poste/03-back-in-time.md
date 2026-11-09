---
title: Back In Time
description: Back In Time, sauvegarde des données personnelles sous Linux avec rsync et liens physiques — installation, profils local, SSH et chiffré gocryptfs, planification, restauration, ligne de commande backintime, interface Qt.
tags: [back in time, sauvegarde, rsync, ssh, gocryptfs, linux, poste]
icon: archive-restore
---

**Back In Time** (GPL-2.0-ou-ultérieure, Python 3) sauvegarde des dossiers avec **rsync** et des liens physiques : chaque sauvegarde est un instantané complet consultable avec un gestionnaire de fichiers, sans espace supplémentaire pour les fichiers inchangés. Il fonctionne en **mode utilisateur** : on sauvegarde ce que l'on peut lire. Pour le système lui-même : [[01-timeshift|Timeshift]]. Alternative plus simple : [[04-deja-dup|Déjà Dup]].

## Installation

| Système | Commandes |
| --- | --- |
| Debian / Ubuntu | `sudo apt install backintime-qt` (interface) ou `backintime-common` (CLI seule) |
| Fedora / RHEL | `sudo dnf install backintime-qt` |
| Arch | `sudo pacman -S backintime` |
| openSUSE | `sudo zypper install backintime-qt` |
| Windows, macOS, BSD | Non pris en charge (utiliser une VM ou un autre outil) |

## Profils de destination

| Mode | Usage |
| --- | --- |
| Local | Disque externe ou dossier monté |
| Local chiffré | Chiffrement **gocryptfs** |
| SSH | Via `sshfs` et rsync sur SSH ; connexion sans mot de passe (clé) requise |
| SSH chiffré | SSH + gocryptfs |

> [!NOTE]
> Dans un profil chiffré, les jokers de type `foo*` sont ignorés dans les exclusions ; seul `*` seul (ex. `foo/*`) fonctionne.

Les propriétaires et permissions sont stockés dans `fileinfo.bz2` : copier un instantané à la main perd les droits d'origine. Pour une sauvegarde planifiée sans session ouverte, le mot de passe peut être conservé en mémoire par le démon `backintime pw-cache` (un administrateur peut le lire).

## Interface graphique

Lancer `backintime-qt` : *Paramètres* → mode, dossiers à inclure/exclure, planification, règles de conservation ; la vue principale permet de parcourir un instantané et de restaurer un fichier ou un dossier.

<!-- CAPTURE: Fenêtre principale Back In Time avec les instantanés et les fichiers | _assets/backintime-principal.png -->
<!-- CAPTURE: Paramètres, onglet Inclure | _assets/backintime-parametres.png -->

## Ligne de commande

```bash
backintime backup
backintime backup --background
backintime --profile-id 2 backup
```

Toutes les commandes figurent dans `man backintime`. Configuration par utilisateur : `~/.config/backintime/config`.

## Dépannage

| Symptôme | Cause | Correction |
| --- | --- | --- |
| Sauvegarde SSH en échec | Pas d'accès par clé | `ssh-copy-id alice@srv-sav-01` |
| Sauvegarde planifiée absente | Disque non monté | Utiliser le déclenchement à la connexion du disque |

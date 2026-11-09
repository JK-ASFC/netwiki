---
title: Timeshift
description: Timeshift, snapshots système sous Linux (modes rsync et Btrfs) — installation Debian, Ubuntu, Fedora, Arch, planification, restauration, ligne de commande timeshift --create --restore --list, exclusions, interface graphique et limites.
tags: [timeshift, snapshot, restauration, rsync, btrfs, linux, sauvegarde système]
icon: history
---

**Timeshift** protège le **système** (fichiers de `/`) : il crée des *snapshots* avant une mise à jour risquée et permet de revenir en arrière. Ce n'est pas une sauvegarde des données personnelles (le dossier utilisateur est exclu par défaut) : pour cela, voir [[03-back-in-time|Back In Time]] ou [[04-deja-dup|Déjà Dup]]. Linux uniquement (Windows, macOS, BSD et conteneur non pris en charge ; pour Windows, utiliser les points de restauration ou une VM).

## Modes

| Mode | Fonctionnement | Prérequis |
| --- | --- | --- |
| **rsync** | Copie avec liens physiques : les fichiers inchangés sont partagés entre snapshots ; chaque snapshot est consultable avec un gestionnaire de fichiers | Tout système de fichiers Linux (ext4, XFS…) |
| **Btrfs** | Snapshots natifs, instantanés et très légers | Disposition de sous-volumes de type Ubuntu (`@` et `@home`) |

Les snapshots sont stockés par défaut dans `/timeshift` sur la partition racine ; il est préférable d'utiliser une **partition ou un disque dédié**. Voir aussi [[28-btrfs-xfs/01-btrfs|Btrfs]] et [[02-snapper|Snapper]].

## Installation

| Système | Commandes |
| --- | --- |
| Debian / Ubuntu / Linux Mint | `sudo apt update && sudo apt install timeshift` |
| Fedora / RHEL | `sudo dnf install timeshift` (le mode Btrfs n'y fonctionne qu'avec une disposition de type Ubuntu) |
| Arch | `sudo pacman -S timeshift` |

Aucun service à activer : la planification repose sur une tâche `cron` créée par Timeshift.

## Premiers pas

1. Lancer `sudo timeshift-gtk` (assistant au premier démarrage) : choisir **rsync** ou **Btrfs**, puis la partition de destination.
2. Définir la planification (mensuel, hebdomadaire, quotidien, horaire, au démarrage) et le nombre de snapshots conservés.
3. Onglet *Filtres* : conserver les fichiers personnels exclus, ou inclure `/home` si nécessaire.
4. Créer un premier snapshot.

<!-- CAPTURE: Assistant Timeshift, choix du type de snapshot et de la destination | _assets/timeshift-assistant.png -->
<!-- CAPTURE: Fenêtre principale Timeshift avec la liste des snapshots | _assets/timeshift-snapshots.png -->

## Ligne de commande

```bash
sudo timeshift --list
sudo timeshift --create --comments "avant mise à jour" --tags D
sudo timeshift --restore --snapshot '2026-11-09_10-00-01' --target /dev/sda1
sudo timeshift --delete --snapshot '2026-11-09_10-00-01'
```

| Option | Rôle |
| --- | --- |
| `--create` | Crée un snapshot immédiatement |
| `--check` | Crée un snapshot seulement si la planification l'exige (utile en cron) |
| `--tags` | Catégorie : `O` à la demande, `B` démarrage, `H` horaire, `D` quotidien, `W` hebdomadaire, `M` mensuel |
| `--restore`, `--snapshot`, `--target` | Restaure un snapshot (sans option : mode interactif) |
| `--grub-device`, `--skip-grub` | Réinstalle ou non GRUB2 lors de la restauration |
| `--delete`, `--delete-all` | Supprime un ou tous les snapshots |
| `--snapshot-device` | Périphérique de stockage (nom ou UUID) |
| `--btrfs`, `--rsync` | Force le mode |
| `--scripted`, `--yes` | Exécution non interactive |

## Exploitation

- Les scripts placés dans `/etc/timeshift/backup-hooks.d/` et `/etc/timeshift/restore-hooks.d/` s'exécutent avant/après les opérations.
- Si le système ne démarre plus, restaurer depuis un *Live USB* après y avoir installé Timeshift.
- Prévoir l'espace : le premier snapshot rsync est une copie complète du système.

| Symptôme | Cause | Correction |
| --- | --- | --- |
| Option Btrfs absente | Sous-volumes différents de `@` et `@home` | Utiliser le mode rsync, ou [[02-snapper\|Snapper]] |
| Disque plein | Trop de snapshots conservés | Réduire la rétention, `--delete` |
| Données perdues après restauration | `/home` exclu | Restaurer les données avec une sauvegarde dédiée |

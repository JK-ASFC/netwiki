---
title: Timeshift et Snapper
description: Instantanés système sous Linux pour annuler une mise à jour ratée — Timeshift (Linux Mint, GPL : modes rsync et Btrfs, planification, restauration depuis le système ou une clé live, commandes timeshift --create/--list/--restore) et Snapper (openSUSE, GPL : configurations, instantanés pré/post zypper, dnf et apt, timeline et nettoyage, status, diff, undochange, rollback, démarrage sur un instantané avec grub-btrfs).
tags: [timeshift, snapper, btrfs, instantanés, snapshots, restauration, linux, rsync]
icon: archive-restore
---

Un **instantané système** fige l'état du système (paquets, `/etc`, noyau) pour y revenir après une mise à jour qui casse le démarrage, un pilote graphique défaillant ou une erreur de configuration. Ce n'est **pas une sauvegarde** : les instantanés restent sur le même disque et disparaissent avec lui. Pour les fichiers personnels, voir [[02-back-in-time-deja-dup|Back In Time et Déjà Dup]].

| | Timeshift | Snapper |
| --- | --- | --- |
| Origine | Linux Mint (licence GPL) | openSUSE / SUSE (licence GPL) |
| Systèmes de fichiers | **rsync** (ext4, XFS… tous) ou **Btrfs** | **Btrfs** (et LVM thin) |
| Interface | Graphique et ligne de commande | Ligne de commande ; YaST et Snapper-GUI en option |
| Intégration aux paquets | Paquet tiers `timeshift-autosnap-apt` | Natif avec zypper ; greffons dnf et apt |
| Retour arrière | Restauration complète (fichiers recopiés ou sous-volumes échangés) | `rollback` du sous-volume racine, ou annulation fichier par fichier (`undochange`) |
| Cas typique | Postes Mint, Ubuntu, Debian, Fedora en ext4 | openSUSE, Fedora/Ubuntu en Btrfs, serveurs SUSE |

## Timeshift

```bash
sudo apt install timeshift        # Debian, Ubuntu, Mint (préinstallé sur Mint)
sudo dnf install timeshift        # Fedora
```

### Modes

- **rsync** : copie du système dans `/timeshift/snapshots` sur le disque choisi ; seuls les fichiers modifiés sont recopiés, les autres sont des liens physiques. Fonctionne avec n'importe quel système de fichiers. Choisir de préférence **un autre disque** que le système.
- **Btrfs** : instantanés instantanés des sous-volumes. Exige l'organisation de type Ubuntu, avec les sous-volumes `@` (racine) et `@home`, sur le même disque.

> [!NOTE]
> Par défaut, Timeshift **exclut les dossiers personnels** : c'est un outil de restauration du système, pas de sauvegarde des documents. On peut inclure les fichiers cachés de `/home` (configurations) dans les réglages.

### Ligne de commande

```bash
sudo timeshift --list                                         # instantanés existants et disque utilisé
sudo timeshift --create --comments "avant mise à niveau" --tags D   # instantané manuel (O à la demande, D quotidien…)
sudo timeshift --restore                                      # menu interactif
sudo timeshift --restore --snapshot '2026-11-11_10-00-01' --target /dev/sda2
sudo timeshift --delete --snapshot '2026-11-11_10-00-01'
sudo timeshift --check                                        # crée un instantané planifié si nécessaire (utilisé par cron)
```

La planification (horaire, quotidienne, hebdomadaire, mensuelle, au démarrage) et le nombre d'instantanés conservés se règlent dans l'interface ou dans `/etc/timeshift/timeshift.json`.

### Restaurer un système qui ne démarre plus

1. Démarrer sur une **clé live** de la distribution.
2. Installer ou lancer Timeshift dans la session live (`sudo apt install timeshift` si besoin).
3. Choisir l'instantané et le disque cible, puis **Restaurer** : Timeshift remet les fichiers et réinstalle GRUB si demandé.
4. Redémarrer.

## Snapper

```bash
sudo zypper install snapper       # préinstallé sur openSUSE avec Btrfs
sudo dnf install snapper python3-dnf-plugin-snapper
sudo apt install snapper          # le paquet Debian installe un crochet apt (instantané pré/post)
```

### Configurations

Une **configuration** par sous-volume surveillé (`root`, `home`…), dans `/etc/snapper/configs/` :

```bash
sudo snapper -c root create-config /       # surveiller la racine (crée le sous-volume /.snapshots)
sudo snapper -c home create-config /home
sudo snapper list-configs
```

Réglages principaux de `/etc/snapper/configs/root` :

| Variable | Rôle |
| --- | --- |
| `TIMELINE_CREATE="yes"` | Instantané horaire automatique (minuteur `snapper-timeline.timer`) |
| `TIMELINE_LIMIT_HOURLY`, `_DAILY`, `_WEEKLY`, `_MONTHLY`, `_YEARLY` | Nombre d'instantanés conservés par période |
| `NUMBER_LIMIT="10"` | Instantanés pré/post conservés (mises à jour) |
| `NUMBER_CLEANUP="yes"`, `TIMELINE_CLEANUP="yes"` | Nettoyage automatique (`snapper-cleanup.timer`) |
| `ALLOW_GROUPS="wheel"` | Groupe autorisé à utiliser Snapper sans être root |

### Commandes

```bash
sudo snapper list                               # numéros, types (single, pre, post), dates, descriptions
sudo snapper create -d "avant changement de pilote"
sudo snapper status 42..43                      # fichiers modifiés entre deux instantanés
sudo snapper diff 42..43 /etc/ssh/sshd_config   # différences d'un fichier
sudo snapper undochange 42..43 /etc/ssh/sshd_config   # annuler les changements de ce fichier
sudo snapper delete 30-35
sudo snapper rollback 42                        # racine Btrfs : repartir de l'instantané 42 au prochain démarrage
```

Avec zypper (et dnf ou apt avec leur greffon), chaque installation ou mise à jour crée une paire **pre/post** : `snapper status <pre>..<post>` montre exactement ce que la mise à jour a modifié.

### Démarrer sur un instantané

openSUSE propose les instantanés dans le menu GRUB (« Start bootloader from a read-only snapshot »). Ailleurs, **grub-btrfs** ajoute une entrée par instantané. Une fois le système démarré sur un bon instantané : `sudo snapper rollback` puis redémarrage pour le rendre permanent.

## Bonnes pratiques

- Créer un instantané **avant** chaque mise à niveau de version, changement de noyau ou de pilote graphique.
- Limiter le nombre d'instantanés conservés : sur Btrfs, de vieux instantanés retiennent l'espace des fichiers supprimés depuis (`btrfs filesystem usage /`).
- Garder une **vraie sauvegarde** des données sur un autre support : voir [[02-back-in-time-deja-dup|Back In Time et Déjà Dup]] et la catégorie Sauvegarde du wiki.

Commandes : [[90-aide-memoire|aide-mémoire]].

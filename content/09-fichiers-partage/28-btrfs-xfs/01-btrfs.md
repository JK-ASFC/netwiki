---
title: Btrfs
description: Btrfs — système de fichiers Linux copie-sur-écriture (GPL) : fonctions (sous-volumes, instantanés, compression zstd, sommes de contrôle, RAID 1/10, envoi/réception), distributions qui l'utilisent par défaut (openSUSE, Fedora), création, sous-volumes et montage, instantanés avec Snapper ou btrbk, retour arrière du système, RAID et état du RAID 5/6, scrub, balance, équilibrage et espace « plein » trompeur, réparation et précautions.
tags: [btrfs, instantanés, sous-volumes, snapper, compression, linux]
icon: info
---

**Btrfs** apporte à Linux des fonctions proches de [[27-openzfs/01-presentation-installation|ZFS]] tout en étant intégré au noyau : **sous-volumes**, **instantanés** quasi instantanés, compression transparente, sommes de contrôle et RAID logiciel. C'est le système par défaut d'[[03-opensuse/01-presentation-installation|openSUSE]] (retour arrière du système avec Snapper) et de Fedora Workstation, et le format des NAS Synology et de nombreux autres NAS.

| Fonction | Statut |
| --- | --- |
| Instantanés, sous-volumes, compression, send/receive | Stables |
| RAID 1, RAID 1C3/1C4, RAID 10 | Stables |
| **RAID 5/6** | Déconseillé pour les métadonnées (risque lors de coupures) ; à éviter en production |

## Création et montage

```bash
sudo mkfs.btrfs -L donnees -m raid1 -d raid1 /dev/sdb /dev/sdc
sudo mount /dev/sdb /mnt && sudo btrfs subvolume create /mnt/@partage && sudo btrfs subvolume create /mnt/@sauvegardes && sudo umount /mnt
echo 'LABEL=donnees /srv/partage btrfs subvol=@partage,compress=zstd:3,noatime 0 0' | sudo tee -a /etc/fstab
sudo mkdir -p /srv/partage && sudo mount /srv/partage
sudo btrfs filesystem usage /srv/partage
```

## Instantanés

```bash
sudo btrfs subvolume snapshot -r /srv/partage /srv/.instantanes/partage-$(date +%F)
sudo btrfs send /srv/.instantanes/partage-2026-11-02 | ssh nas2 sudo btrfs receive /sauv/
sudo snapper -c root list ; sudo snapper -c root rollback 42        # openSUSE / système racine
```

Automatisation : **Snapper** (instantanés horaires, nettoyage) ou **btrbk** (instantanés + réplication).

## Entretien

```bash
sudo btrfs scrub start /srv/partage ; sudo btrfs scrub status /srv/partage   # mensuel
sudo btrfs balance start -dusage=50 /srv/partage                              # récupérer des blocs à moitié vides
sudo btrfs device stats /srv/partage                                          # erreurs par disque
sudo btrfs device add /dev/sdd /srv/partage && sudo btrfs balance start -dconvert=raid1 -mconvert=raid1 /srv/partage
sudo btrfs replace start /dev/sdc /dev/sde /srv/partage
```

> [!WARNING]
> « No space left on device » alors que `df` montre de la place : l'espace de **métadonnées** est épuisé. `btrfs filesystem usage` le montre ; un `balance` filtré libère l'espace. N'utilisez `btrfs check --repair` qu'en dernier recours, sur conseil, après sauvegarde.

Suite : [[02-xfs|XFS]] · [[90-aide-memoire|aide-mémoire]].

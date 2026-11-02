---
title: Présentation, installation et exploitation
description: OpenZFS — système de fichiers et gestionnaire de volumes avec intégrité de bout en bout (CDDL) : concepts (pool, vdev mirror/raidz1-3/dRAID, special, log SLOG, cache L2ARC, datasets, zvols), installation (Ubuntu, Debian contrib et DKMS, RHEL via dépôt zfsonlinux, FreeBSD natif, macOS OpenZFS on OS X, Windows en développement), création de pool, propriétés (compression lz4/zstd, recordsize, atime, quotas, réservations), instantanés et clones, réplication zfs send/receive (Sanoid/Syncoid), scrub, remplacement de disque, ARC et mémoire, chiffrement natif.
tags: [openzfs, zfs, raidz, instantanés, intégrité, zpool, réplication]
icon: info
---

**ZFS** combine gestionnaire de volumes et système de fichiers : sommes de contrôle sur **toutes** les données (détection et correction de la corruption silencieuse), instantanés instantanés, compression, réplication. Il équipe [[21-truenas-scale/01-presentation-installation|TrueNAS]], [[11-proxmox-ve/01-presentation-installation|Proxmox VE]] et FreeBSD.

| Élément | Rôle |
| --- | --- |
| **Pool** (`zpool`) | Ensemble de vdevs ; la perte d'un vdev entier fait perdre le pool |
| **vdev** | `mirror`, `raidz1/2/3` (1 à 3 disques de parité), `draid` (grands pools) |
| `special` | vdev SSD pour métadonnées et petits blocs (à mettre en miroir !) |
| `log` (SLOG) | Accélère les écritures synchrones (NFS, bases) |
| `cache` (L2ARC) | Cache de lecture secondaire sur SSD |
| **Dataset** | Système de fichiers avec ses propriétés ; **zvol** : volume bloc |

## Installation

```bash
sudo apt install zfsutils-linux                              # Ubuntu (module fourni par le noyau)
sudo apt install linux-headers-amd64 zfs-dkms zfsutils-linux # Debian (section contrib)
sudo dnf install https://zfsonlinux.org/epel/zfs-release-2-3$(rpm --eval "%{dist}").noarch.rpm && sudo dnf install zfs && sudo modprobe zfs   # RHEL/Rocky
zfs version
```

FreeBSD : intégré. macOS : OpenZFS on OS X. Windows : portage en développement (non recommandé en production).

## Pool et datasets

```bash
ls -l /dev/disk/by-id/                       # toujours utiliser les identifiants stables
sudo zpool create -o ashift=12 tank raidz2 /dev/disk/by-id/ata-DISQUE{1..6}
sudo zpool add tank special mirror /dev/disk/by-id/nvme-A /dev/disk/by-id/nvme-B
sudo zfs set compression=lz4 atime=off xattr=sa tank
sudo zfs create -o recordsize=1M tank/sauvegardes
sudo zfs create -o recordsize=16K -o logbias=throughput tank/bases
sudo zfs create -o encryption=aes-256-gcm -o keyformat=passphrase tank/confidentiel
sudo zfs set quota=2T tank/sauvegardes ; sudo zfs set sharenfs="rw=@10.0.20.0/24" tank/sauvegardes
zpool status ; zpool list ; zfs list -o name,used,avail,compressratio
```

## Instantanés, réplication et entretien

```bash
sudo zfs snapshot -r tank@$(date +%F)
zfs list -t snapshot ; sudo zfs rollback tank/bases@2026-11-01 ; sudo zfs clone tank/bases@2026-11-01 tank/bases-test
sudo zfs send -R tank/bases@2026-11-02 | ssh nas2 sudo zfs receive -F sauv/bases                     # complet
sudo zfs send -R -i @2026-11-01 tank/bases@2026-11-02 | ssh nas2 sudo zfs receive -F sauv/bases      # incrémental
sudo zpool scrub tank                        # vérification complète (mensuelle)
sudo zpool replace tank /dev/disk/by-id/ata-DISQUE3 /dev/disk/by-id/ata-NOUVEAU
```

Automatisation : **Sanoid** (politique d'instantanés) et **Syncoid** (réplication incrémentale), paquet `sanoid`. Mémoire : l'**ARC** utilise la RAM libre ; limiter si besoin avec `zfs_arc_max` (`/etc/modprobe.d/zfs.conf`).

> [!WARNING]
> Pas de RAID matériel sous ZFS (HBA en mode IT), pas de disques SMR, et une mémoire ECC est fortement recommandée. Un instantané n'est pas une sauvegarde : répliquez vers une autre machine.

Commandes : [[90-aide-memoire|aide-mémoire]].

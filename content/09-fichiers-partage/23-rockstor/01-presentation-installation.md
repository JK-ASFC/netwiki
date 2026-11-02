---
title: Présentation, installation, interface et commandes
description: Rockstor — NAS libre fondé sur openSUSE Leap et Btrfs, installation (ISO), première connexion, pools Btrfs (single, raid1, raid10, raid5/6 et limites), partages, instantanés planifiés, réplication entre Rockstor, SMB, NFS, SFTP, AFP, Rock-ons (applications Docker), mises à jour (canal stable ou testing), interface web et commandes btrfs utiles.
tags: [rockstor, nas, btrfs, opensuse, rock-ons, smb, nfs]
icon: info
---

**Rockstor** (GPL) est un NAS construit sur **openSUSE Leap** et le système de fichiers **Btrfs** : pools, partages (*shares* = sous-volumes), instantanés, réplication, et applications Docker appelées **Rock-ons**. Alternative à [[21-truenas-scale/01-presentation-installation|TrueNAS]] (ZFS) et [[22-openmediavault/01-presentation-installation|OpenMediaVault]] (Debian).

## Installation

ISO « Built on openSUSE » (`rockstor.com/dls.html`) sur un disque système dédié ; installation guidée (langue, clavier, fuseau, mot de passe root), puis interface sur `https://<ip>` : création du compte administrateur, nom d'hôte, choix du **canal de mises à jour** (*Stable* par abonnement de soutien, ou *Testing* gratuit).

## Stockage Btrfs

| Profil | Remarque |
| --- | --- |
| single | Pas de redondance |
| **raid1** / raid1c3 / raid1c4 | Recommandé : 2 (3, 4) copies sur des disques différents |
| raid10 | Performances + redondance |
| raid5 / raid6 | Déconseillés pour les métadonnées (risque historique de *write hole*) : préférer `raid1` pour les métadonnées |

Étapes dans l'interface : **Storage → Disks** (effacer, SMART) → **Pools** (profil, disques, compression zstd/lzo) → **Shares** (taille, propriétaire) → **File Sharing** (Samba, NFS, SFTP, AFP) → **Snapshots** (planifiés dans *System → Scheduled Tasks*) → **Replication** vers un autre Rockstor.

<!-- CAPTURE: Rockstor — tableau de bord | _assets/rockstor-tableau-de-bord.png -->
<!-- CAPTURE: Rockstor — création d'un pool Btrfs en raid1 | _assets/rockstor-pool.png -->
<!-- CAPTURE: Rockstor — Rock-ons disponibles | _assets/rockstor-rock-ons.png -->

## Rock-ons

*Rock-ons* : activer le service (partage dédié pour les données Docker), puis installer les applications du catalogue (Nextcloud, Jellyfin, Plex, Syncthing…) avec leurs partages et ports.

## Maintenance

*System → Scheduled Tasks* : instantanés, **scrub** mensuel, arrêt/réveil ; *System → Updates* ; alertes e-mail (*System → Email Alerts*) ; sauvegarde de la configuration (*System → Config Backup*).

## Commandes utiles

```bash
systemctl status rockstor rockstor-pre rockstor-bootstrap
btrfs filesystem show ; btrfs filesystem usage /mnt2/<pool>
btrfs device stats /mnt2/<pool>                 # erreurs par disque
btrfs scrub start /mnt2/<pool> ; btrfs scrub status /mnt2/<pool>
btrfs subvolume list /mnt2/<pool>
btrfs balance start -dusage=50 /mnt2/<pool>     # rééquilibrage partiel
zypper refresh && zypper up                     # système openSUSE (préférer l'interface pour Rockstor)
tail -f /opt/rockstor/var/log/rockstor.log
```

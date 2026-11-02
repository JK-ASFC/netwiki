---
title: Présentation, installation et configuration
description: TrueNAS Community Edition (ex-SCALE) — NAS libre d'iXsystems sur Debian et OpenZFS, versions (Electric Eel, Fangtooth, Goldeye) et fin de TrueNAS CORE, matériel recommandé (ECC, HBA, SSD de démarrage), installation, réseau, pools ZFS (mirror, RAIDZ, vdev spéciaux, SLOG, L2ARC), jeux de données et ACL, partages SMB, NFS et iSCSI, intégration Active Directory, instantanés et réplication, Cloud Sync, applications (Docker) et machines virtuelles, sauvegarde de la configuration et mises à jour.
tags: [truenas, truenas scale, nas, zfs, smb, nfs, iscsi, réplication]
icon: info
---

**TrueNAS Community Edition** (iXsystems, GPL), anciennement **TrueNAS SCALE**, est un système de NAS complet fondé sur **Debian** et **OpenZFS** : stockage fiable (sommes de contrôle, instantanés, réplication), partages SMB/NFS/iSCSI, applications en conteneurs et machines virtuelles, le tout administré par une **interface web**. TrueNAS CORE (FreeBSD) n'évolue plus : migrez vers la version Debian.

Versions annuelles nommées (24.10 *Electric Eel*, 25.04 *Fangtooth*, 25.10 *Goldeye*) ; pour la production, attendez une version de correction (`.1` ou plus).

## Matériel recommandé

| Élément | Recommandation |
| --- | --- |
| Mémoire | 16 Go minimum, **ECC** conseillée (ZFS utilise la RAM comme cache ARC) |
| Contrôleur | **HBA** en mode IT (LSI/Broadcom) ou SATA de la carte mère — **jamais de RAID matériel** sous ZFS |
| Démarrage | SSD dédié (deux en miroir), 32 Go minimum ; le disque système ne sert pas au stockage |
| Disques de données | Disques NAS (CMR, pas SMR), même taille par vdev |
| Réseau | 10 GbE pour les VM/iSCSI ; agrégat LACP pour de nombreux clients |

## Installation

1. ISO sur `truenas.com/download`, écrite sur une clé USB (`dd` ou Etcher).
2. Installateur texte : *Install/Upgrade* → choix du ou des SSD de démarrage → compte **truenas_admin** et mot de passe → redémarrage.
3. La console affiche l'adresse de l'interface web : `http://10.0.20.110` — passer ensuite en HTTPS et IP fixe (*Network*).

## Pools ZFS

| Disposition | Tolérance | Usage |
| --- | --- | --- |
| **Mirror** (vdev de 2–3 disques) | 1–2 disques par vdev | Performances (VM, bases), extension facile |
| **RAIDZ1** | 1 disque | Petits disques (< 4 To), données non critiques |
| **RAIDZ2** | 2 disques | Recommandé pour 6–12 disques de grande capacité |
| **RAIDZ3** | 3 disques | Très gros vdev |
| **dRAID** | Reconstruction distribuée | Très nombreux disques |

vdev auxiliaires : **SLOG** (journal d'écritures synchrones, NFS/iSCSI), **L2ARC** (cache de lecture), **special** (métadonnées sur SSD, en miroir obligatoire), **spare**. Depuis la 24.10, un vdev RAIDZ peut être **étendu** d'un disque.

## Jeux de données et partages

- **Jeu de données** (*dataset*) par usage : compression **LZ4/ZSTD**, quotas, *record size* (1M pour la vidéo, 16K–64K pour les bases), ACL **SMB/NFSv4** ou POSIX.
- **SMB** : partage par jeu de données (préréglages : *Default*, *Multi-protocol*, *Time Machine*), *Shadow Copies* (instantanés visibles dans « Versions précédentes » de Windows).
- **NFS** : réseaux autorisés, mappage root, NFSv4.
- **iSCSI** : zvol + cible + portail + initiateurs (assistant).
- **Active Directory** : *Credentials → Directory Services* → rejoindre le domaine (DNS pointant vers les DC, horloge synchronisée) ; droits par groupes AD sur les ACL. Voir [[01-samba/01-presentation|Samba]] pour les notions SMB.

## Protection des données

| Fonction | Où |
| --- | --- |
| Instantanés périodiques | *Data Protection → Periodic Snapshot Tasks* (ex. horaire 2 jours, quotidien 30 jours) |
| Réplication | *Replication Tasks* vers un autre TrueNAS (SSH, incrémentale, chiffrée) |
| Cloud Sync | S3 (dont [[07-minio/01-presentation-installation\|MinIO]]), Backblaze B2, Azure, Google Drive — avec chiffrement |
| Rsync | Vers un serveur rsync |
| Scrub | Vérification mensuelle de l'intégrité (*Scrub Tasks*) |
| Tests SMART | Courts hebdomadaires, longs mensuels ; alertes par e-mail |

> [!WARNING]
> Sauvegardez la **configuration** (*System → General → Manage Configuration → Download*, avec la clé de chiffrement des jeux de données chiffrés) : sans elle, des pools chiffrés deviennent illisibles.

## Applications et VM

*Apps* : catalogue d'applications Docker (Nextcloud, Jellyfin, Immich, MinIO…) ou conteneurs personnalisés (fichier Compose) ; *Virtualization* : VM KVM (et conteneurs Incus selon la version). Réservez-les aux besoins légers : un NAS doit rester d'abord un NAS.

## Mises à jour

*System → Update* : train de mises à jour, téléchargement puis redémarrage ; un **environnement d'amorçage** est créé avant chaque mise à jour (retour possible depuis *System → Boot*).

Interface détaillée : [[03-interface-graphique|interface web]] · commandes : [[90-aide-memoire|aide-mémoire]].

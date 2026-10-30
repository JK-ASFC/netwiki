---
title: Clonezilla
description: Clonezilla, clonage et imagerie de disques — Clonezilla Live (device-image et device-device, mode débutant et expert, stockage des images sur disque local, partage SMB/NFS ou SSH), compression et copie intelligente des blocs utilisés, restauration et vérification, migration vers un disque plus grand, Clonezilla Server Edition (déploiement multicast via DRBL/PXE), limites (chiffrement, Secure Boot, identifiants uniques), comparaison avec d'autres outils.
tags: [clonezilla, clonage, image disque, partclone, multicast, drbl, restauration]
icon: copy
---

**Clonezilla** (GPL) copie des disques ou partitions entiers vers une **image** ou vers un **autre disque**, en ne copiant que les **blocs utilisés** (moteur partclone) pour la plupart des systèmes de fichiers (ext4, XFS, NTFS, FAT, Btrfs, HFS+, APFS en lecture brute…). Cas d'usage : sauvegarde « à froid » avant une intervention risquée, migration vers un SSD plus grand, duplication d'un poste ou d'un serveur, déploiement d'une salle de formation.

## Clonezilla Live

Image ISO amorçable (USB ou PXE) ; menus texte guidés.

| Mode | Usage |
| --- | --- |
| **device-image** | Disque/partition → **image** (fichiers) stockée ailleurs |
| **device-device** | Disque → disque (clonage direct, local ou réseau) |
| remote-source / remote-dest | Clonage par le réseau entre deux machines démarrées sur Clonezilla |

Destination des images (*Monter le dépôt d'images*) : disque USB local, **partage SMB** (serveur de fichiers), **NFS**, **SSH**/SFTP, WebDAV, S3 compatible.

### Sauvegarder un disque (device-image, mode débutant)

1. Démarrer sur Clonezilla Live → langue, clavier → *Start Clonezilla* → **device-image**.
2. Choisir le dépôt (ex. `samba_server` : `\\srv-sav-01\Images`, compte avec droits d'écriture).
3. **savedisk** (disque entier) ou saveparts (partitions), nom de l'image (`srv-app-01-2026-10-29`), disque source.
4. Options : vérification des systèmes de fichiers source (`fsck`), **vérification de l'image** après création, compression (zstd/gzip), chiffrement de l'image (option eCryptfs) si le dépôt n'est pas maîtrisé.

### Restaurer

*device-image* → **restoredisk** → image → disque cible. Clonezilla vérifie la taille ; en mode expert, l'option `-k1` crée une table de partitions proportionnelle pour une cible **plus grande**, puis il faut agrandir la dernière partition ([[01-gparted|GParted]]).

La commande équivalente est affichée à la fin de l'assistant : réutilisable dans des scripts (`ocs-sr -q2 -c -j2 -z9p … savedisk nom sda`).

## Clonezilla Server Edition (SE)

Avec **DRBL** (*Diskless Remote Boot in Linux*), un serveur démarre les postes en **PXE** et restaure une image sur des dizaines de machines simultanément en **multidiffusion** (salle de formation, déploiement de masse). Le réseau doit gérer la multidiffusion (IGMP snooping) — voir aussi [[04-wds/02-images-deploiement-depannage|WDS]] pour l'approche Windows.

## Limites et précautions

| Sujet | Point d'attention |
| --- | --- |
| **BitLocker / LUKS** | Clonezilla copie le volume chiffré bloc à bloc (pas d'optimisation) ; suspendre BitLocker ou disposer de la clé de récupération pour la cible |
| Secure Boot | Clonezilla Live (version Ubuntu) démarre avec Secure Boot ; sinon le désactiver temporairement |
| **Windows dupliqué** | Une image clonée sur plusieurs postes doit être généralisée (**Sysprep**) pour éviter des SID et identifiants identiques ; ne jamais cloner un contrôleur de domaine |
| Taille de la cible | Une cible plus **petite** que la source nécessite d'abord de réduire les partitions |
| Disques défaillants | Clonezilla s'arrête sur les secteurs illisibles (option `-rescue`) ; pour un disque mourant, préférer **ddrescue** (voir [[03-testdisk-photorec\|TestDisk et PhotoRec]]) |
| RAID matériel / LVM | Supporté au niveau des volumes présentés ; vérifier le contrôleur dans l'environnement live |

## Comparaison

| Outil | Usage |
| --- | --- |
| **Clonezilla** | Images complètes, gratuit, à froid |
| Rescuezilla | Interface graphique compatible avec les images Clonezilla |
| `dd` / ddrescue | Copie brute bloc à bloc (disques défaillants, formats inconnus) |
| Veeam Agent, UrBackup (images) | Sauvegardes d'images **à chaud** planifiées ([[04-urbackup/01-presentation-installation\|UrBackup]]) |
| WDS, MDT, Autopilot | Déploiement de Windows |

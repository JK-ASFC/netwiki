---
title: GParted
description: GParted, éditeur de partitions graphique — GParted Live (démarrage USB/PXE) et paquet Linux, tables de partitions MBR et GPT, création, redimensionnement, déplacement, copie et vérification de partitions (ext4, XFS, NTFS, FAT32, Btrfs, LVM partiel), cas d'usage (agrandir un disque de VM, préparer un disque, récupérer de l'espace), précautions (sauvegarde, chiffrement, RAID/LVM), équivalents en ligne de commande et sous Windows.
tags: [gparted, partitions, gpt, mbr, redimensionnement, ntfs, ext4, live]
icon: hard-drive
---

**GParted** (GPL) est l'éditeur de partitions graphique de référence sous Linux. Sa version **GParted Live** démarre depuis une clé USB ou en PXE et permet de modifier les partitions d'un disque **non monté**, y compris d'un système Windows ou Linux arrêté.

> [!WARNING]
> Toute opération de partitionnement peut **détruire des données** (coupure de courant, mauvais disque sélectionné, système de fichiers incohérent). **Sauvegarde vérifiée** avant toute modification ; vérifiez trois fois le disque cible (taille, modèle, `/dev/sdX`).

## Obtenir GParted

| Forme | Usage |
| --- | --- |
| **GParted Live** (ISO) | Clé USB amorçable (Rufus, Ventoy, `dd`), CD, PXE ; indispensable pour le disque système |
| Paquet `gparted` | Sur un Linux de bureau, pour les disques de données non montés |
| Inclus dans d'autres environnements | Ventoy + ISO, SystemRescue, distributions « live » |

```bash
sudo dd if=gparted-live-1.7.0-1-amd64.iso of=/dev/sdX bs=4M status=progress conv=fsync   # sdX = la clé USB, pas un disque système !
```

## Opérations

| Opération | Remarques |
| --- | --- |
| Créer une **table de partitions** | **GPT** pour les disques > 2 To et l'UEFI ; MBR pour les anciens systèmes BIOS |
| Créer / supprimer / formater | ext4, XFS, Btrfs, NTFS, FAT32, exFAT, swap… |
| **Redimensionner / déplacer** | Agrandir (vers un espace libre adjacent) ou réduire ; déplacer est long et risqué |
| Copier / coller une partition | Vers un autre disque |
| Vérifier | Lance `e2fsck`, `ntfsfix`… |
| Étiquette, UUID, drapeaux | `boot`, `esp`, `lvm`, `msftres` |

Les opérations sont **mises en file d'attente** puis appliquées (*Appliquer toutes les opérations*) : relisez la liste avant de valider.

## Cas d'usage : agrandir le disque d'une VM

1. Agrandir le disque virtuel dans l'hyperviseur (VMware, Hyper-V, Proxmox) et prendre un instantané.
2. Démarrer la VM sur l'ISO GParted Live.
3. Déplacer éventuellement la partition de récupération qui suit, puis agrandir la partition système dans l'espace libre.
4. Redémarrer sur le système, vérifier, supprimer l'instantané.

Sous Linux sans redémarrer, la ligne de commande fait la même chose à chaud :

```bash
sudo growpart /dev/sda 2                 # agrandir la partition 2 (paquet cloud-guest-utils)
sudo resize2fs /dev/sda2                 # ext4 (à chaud)
sudo xfs_growfs /                        # XFS (à chaud, par point de montage)
# Avec LVM : pvresize /dev/sda3 && lvextend -r -l +100%FREE /dev/vg0/racine
```

## Limites et précautions

- **LVM** : GParted gère mal les volumes logiques (seulement le volume physique) : utilisez les commandes LVM.
- **RAID** logiciel, **BitLocker**/LUKS : opérer au niveau du conteneur ou déchiffrer d'abord ; ne jamais redimensionner un volume BitLocker avec GParted (suspendre BitLocker et utiliser la gestion des disques de Windows).
- **XFS** ne peut pas être réduit.
- Réduire NTFS : défragmenter et désactiver l'hibernation/le fichier d'échange auparavant ; lancer `chkdsk` au redémarrage suivant.

## Équivalents

| Système | Outils |
| --- | --- |
| Linux (CLI) | `parted`, `fdisk`/`gdisk`, `sfdisk`, `lsblk`, `growpart`, `resize2fs` |
| Windows | **Gestion des disques** (`diskmgmt.msc`), `diskpart`, PowerShell (`Resize-Partition`, `Get-PartitionSupportedSize`) |
| macOS | Utilitaire de disque, `diskutil` |

```powershell
$taille = (Get-PartitionSupportedSize -DriveLetter C).SizeMax
Resize-Partition -DriveLetter C -Size $taille        # agrandir C: dans l'espace libre (à chaud)
```

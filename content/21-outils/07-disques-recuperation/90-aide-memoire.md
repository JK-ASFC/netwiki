---
title: Disques et récupération — aide-mémoire (GParted, parted, Clonezilla, TestDisk, PhotoRec)
description: Commandes de gestion de disques et de récupération avec exemples — identification (lsblk, blkid, smartctl, Get-Disk), partitionnement en ligne de commande (parted, sgdisk, diskpart, PowerShell Storage), redimensionnement de systèmes de fichiers, clonage et images (Clonezilla, dd, ddrescue, partclone), vérification (fsck, chkdsk), TestDisk (récupération de partitions) et PhotoRec (récupération de fichiers), bonnes pratiques (travailler sur une copie).
tags: [aide-mémoire, gparted, parted, diskpart, clonezilla, ddrescue, testdisk, photorec]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-gparted|GParted]], [[02-clonezilla|Clonezilla]] et [[03-testdisk-photorec|TestDisk et PhotoRec]].

> [!WARNING]
> Vérifiez **trois fois** le disque cible (`/dev/sdX`, numéro de disque Windows) avant toute écriture. Pour une récupération, travaillez sur une **image** du disque, jamais sur l'original.

## Identifier les disques

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS,MODEL,SERIAL
sudo blkid
sudo fdisk -l /dev/sdb
sudo smartctl -a /dev/sdb | grep -Ei "health|reallocated|pending|power_on"
sudo smartctl -t short /dev/sdb
```

```powershell
Get-Disk | Format-Table Number, FriendlyName, Size, PartitionStyle, HealthStatus, OperationalStatus
Get-PhysicalDisk | Get-StorageReliabilityCounter | Select-Object DeviceId, Temperature, ReadErrorsTotal, Wear
```

## Partitionner

```bash
sudo parted /dev/sdb --script mklabel gpt mkpart donnees ext4 1MiB 100%
sudo parted /dev/sdb print
sudo mkfs.ext4 -L donnees /dev/sdb1
sudo sgdisk -p /dev/sdb                              # table GPT
sudo sgdisk --backup=/root/sdb-gpt.bak /dev/sdb      # sauvegarder la table
sudo growpart /dev/sda 2 && sudo resize2fs /dev/sda2  # agrandir après extension du disque virtuel
sudo xfs_growfs /                                     # XFS (monté)
```

```powershell
# PowerShell
Initialize-Disk -Number 2 -PartitionStyle GPT
New-Partition -DiskNumber 2 -UseMaximumSize -DriveLetter E | Format-Volume -FileSystem NTFS -NewFileSystemLabel "Donnees" -Confirm:$false
Resize-Partition -DriveLetter C -Size (Get-PartitionSupportedSize -DriveLetter C).SizeMax
# diskpart (script)
@"
select disk 2
clean
convert gpt
create partition primary
format fs=ntfs quick label=Donnees
assign letter=E
"@ | Set-Content C:\Temp\diskpart.txt
diskpart /s C:\Temp\diskpart.txt
```

## Vérifier et réparer

```bash
sudo umount /dev/sdb1 && sudo fsck -f /dev/sdb1
sudo e2fsck -fy /dev/sdb1
sudo xfs_repair /dev/sdb1
```

```powershell
chkdsk D: /scan
chkdsk D: /f            # correction (volume démonté ou au redémarrage)
Repair-Volume -DriveLetter D -OfflineScanAndFix
```

## Cloner et créer des images

```bash
# Disque défaillant : ddrescue copie d'abord ce qui est lisible, puis réessaie les zones abîmées
sudo ddrescue -n /dev/sdb /srv/images/sdb.img /srv/images/sdb.map
sudo ddrescue -r3 /dev/sdb /srv/images/sdb.img /srv/images/sdb.map
# Copie brute d'un disque sain
sudo dd if=/dev/sdb of=/srv/images/sdb.img bs=4M status=progress conv=fsync
# partclone : n'image que les blocs utilisés
sudo partclone.ext4 -c -s /dev/sdb1 -o /srv/images/sdb1.pc
sudo partclone.ext4 -r -s /srv/images/sdb1.pc -o /dev/sdc1
# Monter une image pour l'explorer en lecture seule
sudo losetup -fP --read-only /srv/images/sdb.img && lsblk
```

Clonezilla (Live) : *device-image* (sauvegarde vers un partage SSH/SMB/NFS ou un disque) ou *device-device* (clonage direct) ; mode **Expert** pour ajuster la compression (`-z9p` zstd) et vérifier l'image après création.

## TestDisk et PhotoRec

```bash
sudo testdisk /srv/images/sdb.img          # Analyse → Quick Search → Deeper Search → Write (table de partitions)
sudo testdisk /log /dev/sdb                 # journal testdisk.log dans le dossier courant
sudo photorec /srv/images/sdb.img          # choisir la partition, le type de système de fichiers, puis le dossier de destination
sudo photorec /d /srv/recuperation /cmd /srv/images/sdb.img partition_none,fileopt,everything,disable,jpg,enable,pdf,enable,docx,enable,search
```

| Outil | Usage |
| --- | --- |
| TestDisk | Retrouver une **table de partitions** perdue, reconstruire un secteur d'amorçage, copier des fichiers supprimés (FAT, NTFS, ext) |
| PhotoRec | Récupérer des **fichiers** par leur signature, même sans système de fichiers (noms et arborescence perdus) |

Restaurez toujours vers un **autre disque** que celui analysé.

---
title: TestDisk et PhotoRec
description: Récupération de données avec TestDisk et PhotoRec (CGSecurity) — démarche (arrêter d'écrire, copie du disque avec ddrescue), TestDisk pour retrouver des partitions perdues, réparer la table de partitions, les secteurs de démarrage et les superblocs, récupérer des fichiers supprimés (FAT, NTFS, ext), PhotoRec pour la récupération par signatures de fichiers, limites (SSD et TRIM, chiffrement, écrasement), et quand faire appel à un laboratoire.
tags: [testdisk, photorec, récupération de données, partitions, ddrescue, fichiers supprimés]
icon: undo
---

**TestDisk** et **PhotoRec** (GPL, CGSecurity) sont des outils libres de **récupération de données**, disponibles pour Windows, Linux et macOS, et inclus dans la plupart des environnements de secours (SystemRescue, Kali, GParted Live).

| Outil | Rôle |
| --- | --- |
| **TestDisk** | Retrouver des **partitions** perdues, reconstruire la table de partitions, réparer les secteurs de démarrage (FAT, NTFS) et superblocs (ext), récupérer des fichiers supprimés sur FAT/NTFS/ext |
| **PhotoRec** | Récupérer des **fichiers** par leurs signatures (*carving*), même si le système de fichiers est détruit ou reformaté — sans les noms ni l'arborescence |

## Démarche

1. **Arrêter immédiatement** d'écrire sur le support (ne pas installer l'outil dessus, ne pas y restaurer les fichiers).
2. Si le disque est **physiquement défaillant** (bruits, secteurs illisibles, déconnexions) : faire d'abord une **image** avec **ddrescue**, puis travailler sur l'image. Si les données sont critiques et le disque très abîmé : laboratoire spécialisé, sans insister.
3. Travailler sur une **copie** chaque fois que possible.
4. Récupérer vers **un autre disque**.

```bash
sudo apt install gddrescue testdisk
# Image d'un disque défaillant : d'abord les zones faciles, puis les secteurs difficiles (journal pour reprendre)
sudo ddrescue -n /dev/sdb /mnt/secours/disque.img /mnt/secours/disque.map
sudo ddrescue -d -r3 /dev/sdb /mnt/secours/disque.img /mnt/secours/disque.map
```

## TestDisk : partitions perdues

```bash
sudo testdisk /mnt/secours/disque.img       # ou le disque : sudo testdisk /dev/sdb
```

1. *Create* (journal `testdisk.log`) → choisir le disque → type de table (**Intel** pour MBR, **EFI GPT**) détecté.
2. **Analyse** → *Quick Search* : liste des partitions retrouvées ; `P` pour lister les fichiers et vérifier que c'est la bonne.
3. *Deeper Search* si nécessaire (plus long).
4. Marquer les partitions à conserver (Primaire, Logique), puis **Write** pour réécrire la table de partitions.

Autres réparations (menu *Advanced*) : reconstruire le secteur de démarrage NTFS depuis sa copie de secours (*Backup BS*), **MFT** (copie miroir), superbloc ext de secours.

## TestDisk : fichiers supprimés

*Advanced* → partition → **Undelete** (FAT, NTFS, exFAT ; *List* pour ext) : les fichiers supprimés apparaissent en rouge ; `c` pour copier la sélection vers un autre emplacement.

## PhotoRec : récupération par signatures

```bash
sudo photorec /mnt/secours/disque.img
```

1. Choisir la partition (ou le disque entier), le type de système de fichiers (*ext2/3/4* ou *Other* pour FAT/NTFS/HFS+).
2. *Free* (espace non alloué seulement, après suppression) ou *Whole* (tout, après formatage ou corruption).
3. **File Opt** : limiter aux types utiles (docx, xlsx, pdf, jpg…) pour réduire le volume et le bruit.
4. Dossier de destination sur **un autre disque** : les fichiers sont nommés `recup_dir.N/f1234567.pdf`.

QPhotoRec offre une interface graphique (Windows : `qphotorec_win.exe`).

## Limites

| Situation | Chances de récupération |
| --- | --- |
| Fichier supprimé récemment sur disque dur, peu d'écritures depuis | Bonnes |
| Partition supprimée / table de partitions écrasée | Très bonnes avec TestDisk |
| Formatage rapide | Bonnes (PhotoRec), sans noms de fichiers |
| **SSD avec TRIM** | Faibles : les blocs libérés sont effacés par le contrôleur rapidement |
| Volume **chiffré** (BitLocker, LUKS) sans clé | Nulles — d'où l'importance de sauvegarder les clés de récupération ([[11-bitlocker/02-gestion-recuperation-depannage\|BitLocker]]) |
| Données écrasées | Nulles |
| Fichiers chiffrés par un rançongiciel | Récupération possible d'anciennes copies supprimées dans certains cas, mais la vraie protection est la **sauvegarde** ([[01-restic/01-presentation-installation\|sauvegarde]]) |

> [!TIP]
> La récupération de données n'est pas une stratégie : chaque intervention de ce type doit déboucher sur une question « pourquoi ces données n'étaient-elles pas sauvegardées ? ».

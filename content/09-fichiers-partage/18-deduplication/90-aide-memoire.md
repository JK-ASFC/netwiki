---
title: Déduplication des données Windows — aide-mémoire des commandes
description: Commandes de déduplication Windows Server avec exemples — installation, évaluation (DDPEval), activation par type d'usage (Default, HyperV, Backup), exclusions et âge minimal, tâches (optimisation, ramasse-miettes, nettoyage, intégrité), planifications, état et gains (Get-DedupStatus, Get-DedupVolume), désactivation et réhydratation, bonnes pratiques avec les sauvegardes.
tags: [aide-mémoire, déduplication, dedup, windows server, stockage]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-deduplication|déduplication]].

## Installation et évaluation

```powershell
Install-WindowsFeature FS-Data-Deduplication
& "$env:SystemRoot\System32\DDPEval.exe" E:\Partages     # estimation des gains avant activation
```

## Activation et réglages

```powershell
Enable-DedupVolume -Volume E: -UsageType Default          # serveur de fichiers généraliste
Enable-DedupVolume -Volume F: -UsageType HyperV           # VDI (VHDX ouverts)
Enable-DedupVolume -Volume G: -UsageType Backup           # cibles de sauvegarde virtualisées
Set-DedupVolume -Volume E: -MinimumFileAgeDays 3 -ExcludeFolder "E:\Partages\Bases" -ExcludeFileType "mp4","zip"
Get-DedupVolume | Format-List Volume, Enabled, UsageType, MinimumFileAgeDays, SavedSpace, SavingsRate
```

## Tâches

```powershell
Start-DedupJob -Volume E: -Type Optimization -Memory 50
Start-DedupJob -Volume E: -Type GarbageCollection -Full
Start-DedupJob -Volume E: -Type Scrubbing -Full            # vérification d'intégrité
Get-DedupJob
Stop-DedupJob -Volume E:
Get-DedupSchedule
New-DedupSchedule -Name "Optimisation de nuit" -Type Optimization -Days Monday,Tuesday,Wednesday,Thursday,Friday -Start 22:00 -DurationHours 6
Set-DedupSchedule -Name "BackgroundOptimization" -Enabled $false
```

## État et gains

```powershell
Get-DedupStatus | Format-List Volume, SavedSpace, OptimizedFilesCount, InPolicyFilesCount, LastOptimizationResult
Get-DedupMetadata -Volume E:
Measure-DedupFileMetadata -Path E:\Partages\Reseau        # espace libéré si ce dossier était supprimé
```

## Désactivation (réhydratation)

```powershell
Disable-DedupVolume -Volume E:                             # arrête la déduplication des nouveaux fichiers
Start-DedupJob -Volume E: -Type Unoptimization             # réhydrate (prévoir l'espace disque nécessaire !)
```

> [!WARNING]
> Le logiciel de sauvegarde doit prendre en charge la déduplication (sauvegarde optimisée au niveau bloc), sinon il lira les fichiers réhydratés et la restauration peut exiger plus d'espace que le volume d'origine.

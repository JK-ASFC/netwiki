---
title: Sauvegarde Windows Server — aide-mémoire des commandes
description: Commandes de la Sauvegarde Windows Server avec exemples — installation, wbadmin (sauvegarde ponctuelle, bare metal, état du système, planifiée, versions, éléments, restauration de fichiers, de volumes et de l'état du système), module WindowsServerBackup (stratégies WBPolicy), restauration complète depuis WinRE, journaux et limites.
tags: [aide-mémoire, windows server backup, wbadmin, bare metal, état du système]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-sauvegarde-restauration|Sauvegarde Windows Server]].

## Installation

```powershell
Install-WindowsFeature Windows-Server-Backup
```

## wbadmin

```powershell
wbadmin start backup -backupTarget:E: -include:C:,D: -allCritical -vssFull -quiet
wbadmin start backup -backupTarget:\\nas\sauvegardes\srv01 -include:D:\Donnees -quiet       # cible réseau (une seule version conservée)
wbadmin start systemstatebackup -backupTarget:E: -quiet
wbadmin enable backup -addtarget:{GUID-du-disque} -schedule:02:00 -allCritical -include:D: -quiet
wbadmin get disks                                    # identifiants des disques cibles
wbadmin get versions
wbadmin get items -version:10/30/2026-02:00
wbadmin get status
wbadmin start recovery -version:10/30/2026-02:00 -itemType:File -items:D:\Donnees\Compta -recursive -recoveryTarget:D:\Restauration
wbadmin start recovery -version:10/30/2026-02:00 -itemType:Volume -items:D:
wbadmin start systemstaterecovery -version:10/30/2026-02:00          # en mode restauration des services d'annuaire pour un DC
wbadmin delete backup -keepVersions:10
```

## Module PowerShell

```powershell
$p = New-WBPolicy
Add-WBBareMetalRecovery -Policy $p
Add-WBSystemState -Policy $p
Add-WBVolume -Policy $p -Volume (Get-WBVolume -VolumePath D:)
$cible = New-WBBackupTarget -Disk (Get-WBDisk | Where-Object DiskNumber -eq 2)
Add-WBBackupTarget -Policy $p -Target $cible
Set-WBSchedule -Policy $p -Schedule 02:00, 13:00
Set-WBPolicy -Policy $p -Force
Get-WBPolicy
Get-WBSummary
Get-WBJob -Previous 5
Get-WBBackupSet | Select-Object VersionId, BackupTime, BackupTarget
```

## Restauration complète (bare metal)

Démarrer sur le support d'installation de Windows Server → *Réparer l'ordinateur* → *Dépannage* → *Récupération de l'image système*, puis choisir la sauvegarde (disque local ou partage réseau `\\nas\sauvegardes`).

## Journaux et limites

```powershell
Get-WinEvent -LogName "Microsoft-Windows-Backup" -MaxEvents 20 | Format-Table TimeCreated, Id, Message -Wrap
```

- Une cible **réseau** ne conserve qu'une seule version (écrasée à chaque sauvegarde) ; un disque dédié conserve plusieurs versions.
- Outil adapté aux petits environnements : pas de déduplication globale, de catalogue central ni d'immuabilité ; compléter par une copie hors site.

---
title: Veeam Backup & Replication — aide-mémoire des commandes
description: Commandes PowerShell Veeam avec exemples — connexion (Connect-VBRServer), travaux (Get-VBRJob, Start-VBRJob, sessions et résultats), points de restauration, restauration de VM et de fichiers (Start-VBRRestoreVM, Start-VBRWindowsFileRestore), référentiels (Get-VBRBackupRepository, immuabilité), SureBackup, sauvegarde de la configuration, agents Linux (veeamconfig) et Windows, journaux.
tags: [aide-mémoire, veeam, powershell, sauvegarde, restauration, immuable]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-architecture|Veeam]]. Module PowerShell `Veeam.Backup.PowerShell` installé avec la console.

## Connexion et travaux

```powershell
Import-Module Veeam.Backup.PowerShell
Connect-VBRServer -Server vbr01.corp.exemple.fr
Get-VBRJob | Format-Table Name, JobType, IsScheduleEnabled, @{n="Dernier";e={$_.GetLastResult()}}
Get-VBRComputerBackupJob | Format-Table Name, Mode       # sauvegardes d'agents
Start-VBRJob -Job (Get-VBRJob -Name "Serveurs-Paris") -RunAsync
Stop-VBRJob -Job (Get-VBRJob -Name "Serveurs-Paris")
Disable-VBRJob -Job (Get-VBRJob -Name "Ancien-Job")
Get-VBRBackupSession | Sort-Object EndTime -Descending | Select-Object -First 10 JobName, Result, EndTime
(Get-VBRBackupSession | Where-Object JobName -eq "Serveurs-Paris" | Sort-Object EndTime -Descending | Select-Object -First 1).GetTaskSessions() | Select-Object Name, Status
```

## Points de restauration et restauration

```powershell
$rp = Get-VBRBackup -Name "Serveurs-Paris" | Get-VBRRestorePoint -Name "srv-web01" | Sort-Object CreationTime -Descending | Select-Object -First 1
$rp | Format-List VmName, CreationTime, Type
Start-VBRRestoreVM -RestorePoint $rp -Server (Get-VBRServer -Name "esx01.corp.exemple.fr") -VMName "srv-web01-restaure" -PowerUp $false -RunAsync
Start-VBRInstantRecovery -RestorePoint $rp -VMName "srv-web01-ir"          # VMware : restauration instantanée
$session = Start-VBRWindowsFileRestore -RestorePoint $rp                    # montage pour restauration de fichiers
# … copier les fichiers depuis le point de montage indiqué …
Stop-VBRWindowsFileRestore -FileRestore $session
```

## Référentiels et configuration

```powershell
Get-VBRBackupRepository | Format-Table Name, Type, Path, @{n="Libre(Go)";e={[math]::Round($_.GetContainer().CachedFreeSpace.InGigabytes)}}
Get-VBRBackupRepository -ScaleOut | Select-Object Name, PerformanceExtent, CapacityExtent
Get-VBRConfigurationBackupJob | Select-Object Name, Target, LastResult
Start-VBRConfigurationBackupJob
Get-VBRSureBackupJob | Format-Table Name, LastResult
Disconnect-VBRServer
```

## Agents

```bash
# Veeam Agent for Linux
veeamconfig ui                               # interface texte
veeamconfig job list
veeamconfig job start --name "srv-linux-quotidien"
veeamconfig session list
veeamconfig session log --id <id>
veeamconfig backup list
```

```powershell
# Veeam Agent for Windows
& "C:\Program Files\Veeam\Endpoint Backup\Veeam.EndPoint.Manager.exe" /backup
Get-Service VeeamEndpointBackupSvc
```

## Journaux

```powershell
Get-ChildItem "C:\ProgramData\Veeam\Backup" -Directory | Select-Object Name   # un dossier par travail (journaux Job.*.log)
```

> [!IMPORTANT]
> Protégez le serveur Veeam comme un contrôleur de domaine (cible prioritaire des rançongiciels) : hors domaine de production ou durci, MFA sur la console, **référentiel immuable** (Linux durci, stockage objet avec verrouillage), copie hors ligne, correctifs appliqués rapidement.

---
title: WSUS — aide-mémoire des commandes
description: Commandes WSUS avec exemples — installation et post-installation (wsusutil postinstall), module UpdateServices (Get-WsusServer, synchronisation, classifications et produits, approbations, refus, nettoyage Invoke-WsusServerCleanup, groupes d'ordinateurs), côté client (GPO, wuauclt/usoclient, Get-WindowsUpdateLog, PSWindowsUpdate), maintenance de la base, réinitialisation du contenu, dépannage.
tags: [aide-mémoire, wsus, windows update, updateservices, gpo, pswindowsupdate]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|WSUS]].

## Installation

```powershell
Install-WindowsFeature UpdateServices -IncludeManagementTools
& "$env:ProgramFiles\Update Services\Tools\wsusutil.exe" postinstall CONTENT_DIR=E:\WSUS
& "$env:ProgramFiles\Update Services\Tools\wsusutil.exe" checkhealth
```

## Serveur et synchronisation

```powershell
$w = Get-WsusServer -Name wsus01 -PortNumber 8530
$cfg = $w.GetConfiguration(); $cfg.AllUpdateLanguagesEnabled = $false; $cfg.SetEnabledUpdateLanguages("fr"); $cfg.Save()
Get-WsusClassification | Where-Object { $_.Classification.Title -in "Mises à jour critiques", "Mises à jour de sécurité", "Mises à jour cumulatives" } | Set-WsusClassification
Get-WsusProduct | Where-Object { $_.Product.Title -like "Windows Server 2022*" -or $_.Product.Title -like "Windows 11*" } | Set-WsusProduct
$s = $w.GetSubscription(); $s.StartSynchronization()
$s.GetSynchronizationStatus(); $s.GetLastSynchronizationInfo()
```

## Approbations

```powershell
$w.CreateComputerTargetGroup("Pilote")
Get-WsusUpdate -Approval Unapproved -Status FailedOrNeeded -Classification Security |
  Approve-WsusUpdate -Action Install -TargetGroupName "Pilote"
Get-WsusUpdate -Classification All -Approval AnyExceptDeclined | Where-Object { $_.Update.IsSuperseded } | Deny-WsusUpdate
Get-WsusComputer -All | Select-Object FullDomainName, LastReportedStatusTime, RequestedTargetGroupName | Sort-Object LastReportedStatusTime
```

## Nettoyage et maintenance

```powershell
Invoke-WsusServerCleanup -CleanupObsoleteComputers -CleanupObsoleteUpdates -CleanupUnneededContentFiles -CompressUpdates -DeclineExpiredUpdates -DeclineSupersededUpdates
& "$env:ProgramFiles\Update Services\Tools\wsusutil.exe" reset          # revérifier le contenu
# Réindexer la base SUSDB (script Microsoft « WSUS DB Maintenance » via sqlcmd sur WID)
sqlcmd -S np:\\.\pipe\MICROSOFT##WID\tsql\query -i C:\Scripts\WsusDBMaintenance.sql
```

## Côté client

```powershell
# GPO : Configurer les mises à jour automatiques + Spécifier l'emplacement intranet (http://wsus01.corp.exemple.fr:8530)
Get-ItemProperty HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate
usoclient StartScan
Get-WindowsUpdateLog -LogPath C:\Temp\WindowsUpdate.log
Install-Module PSWindowsUpdate -Scope AllUsers
Get-WindowsUpdate
Install-WindowsUpdate -MicrosoftUpdate -AcceptAll -IgnoreReboot
Get-WUHistory | Select-Object -First 10 Date, Title, Result
```

## Dépannage

```powershell
Get-Content "$env:ProgramFiles\Update Services\LogFiles\SoftwareDistribution.log" -Tail 30
Test-NetConnection wsus01 -Port 8530
# Pool IIS WsusPool : augmenter la limite mémoire privée si erreurs 503
Set-ItemProperty IIS:\AppPools\WsusPool -Name recycling.periodicRestart.privateMemory -Value 0
```

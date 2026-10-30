---
title: Microsoft Defender Antivirus — aide-mémoire des commandes
description: Commandes Microsoft Defender Antivirus avec exemples — état (Get-MpComputerStatus), mises à jour des signatures, analyses (rapide, complète, personnalisée, hors ligne), menaces détectées et quarantaine, exclusions, préférences (protection en temps réel, cloud, PUA, réseau, accès contrôlé aux dossiers, ASR), MpCmdRun.exe, journaux, Defender sous Linux et macOS (mdatp).
tags: [aide-mémoire, defender, antivirus, powershell, mpcmdrun, asr, mdatp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-antivirus-configuration|Microsoft Defender]].

## État et mises à jour

```powershell
Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled, AntivirusSignatureVersion, AntivirusSignatureLastUpdated, IsTamperProtected
Update-MpSignature
Update-MpSignature -UpdateSource MicrosoftUpdateServer
& "$env:ProgramFiles\Windows Defender\MpCmdRun.exe" -SignatureUpdate
& "$env:ProgramFiles\Windows Defender\MpCmdRun.exe" -RemoveDefinitions -DynamicSignatures     # en cas de problème de signatures
```

## Analyses

```powershell
Start-MpScan -ScanType QuickScan
Start-MpScan -ScanType FullScan -AsJob
Start-MpScan -ScanType CustomScan -ScanPath "D:\Depot"
Start-MpWDOScan                                   # analyse hors ligne (redémarrage)
& "$env:ProgramFiles\Windows Defender\MpCmdRun.exe" -Scan -ScanType 3 -File "D:\Depot\fichier.zip" -DisableRemediation
Start-MpScan -ScanType QuickScan -CimSession (New-CimSession srv-web01)     # à distance
```

## Menaces et quarantaine

```powershell
Get-MpThreatDetection | Select-Object InitialDetectionTime, ThreatID, Resources, ActionSuccess
Get-MpThreat | Select-Object ThreatName, SeverityID, IsActive
Remove-MpThreat
& "$env:ProgramFiles\Windows Defender\MpCmdRun.exe" -Restore -ListAll
& "$env:ProgramFiles\Windows Defender\MpCmdRun.exe" -Restore -Name "Trojan:Win32/Exemple" -FilePath "C:\Temp\fichier.exe"
```

## Préférences

```powershell
Get-MpPreference | Select-Object DisableRealtimeMonitoring, MAPSReporting, PUAProtection, EnableNetworkProtection, EnableControlledFolderAccess
Set-MpPreference -PUAProtection Enabled -MAPSReporting Advanced -SubmitSamplesConsent SendSafeSamples -CloudBlockLevel High
Set-MpPreference -EnableNetworkProtection Enabled
Set-MpPreference -EnableControlledFolderAccess Enabled
Add-MpPreference -ControlledFolderAccessAllowedApplications "C:\Program Files\Appli\appli.exe"
Add-MpPreference -ExclusionPath "D:\SQLData" -ExclusionExtension ".mdf", ".ldf"
Add-MpPreference -ExclusionProcess "sqlservr.exe"
Remove-MpPreference -ExclusionPath "D:\Ancien"
# Règles de réduction de la surface d'attaque (ASR) : ex. bloquer les processus enfants d'Office
Add-MpPreference -AttackSurfaceReductionRules_Ids D4F940AB-401B-4EFC-AADC-AD5F3C50688A -AttackSurfaceReductionRules_Actions Enabled
Get-MpPreference | Select-Object -ExpandProperty AttackSurfaceReductionRules_Ids
```

(Avec la protection contre les falsifications et une gestion par Intune/GPO, les réglages locaux peuvent être ignorés : modifiez la stratégie centrale.)

## Journaux et diagnostic

```powershell
Get-WinEvent -LogName "Microsoft-Windows-Windows Defender/Operational" -MaxEvents 20 | Format-Table TimeCreated, Id, Message -Wrap
& "$env:ProgramFiles\Windows Defender\MpCmdRun.exe" -GetFiles      # archive de diagnostic
```

| Événement | Sens |
| --- | --- |
| 1116 / 1117 | Menace détectée / action effectuée |
| 1006 / 1007 | Logiciel malveillant détecté / action (anciennes versions) |
| 5001 | Protection en temps réel désactivée |
| 1121 / 1122 | Règle ASR : blocage / audit |

## Linux et macOS (Defender for Endpoint)

```bash
mdatp health
mdatp health --field real_time_protection_enabled
mdatp definitions update
mdatp scan quick
mdatp threat list
mdatp exclusion folder add --path /var/lib/mysql
```

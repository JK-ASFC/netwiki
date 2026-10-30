---
title: FSRM — aide-mémoire des commandes
description: Commandes FSRM avec exemples — installation, quotas (modèles, quotas automatiques, seuils et notifications), filtrage de fichiers (groupes de fichiers, modèles, filtres actifs/passifs, exceptions), protection contre les rançongiciels par filtrage, classification (propriétés, règles), tâches de gestion de fichiers, rapports de stockage, paramètres SMTP, dirquota et filescrn.
tags: [aide-mémoire, fsrm, quotas, filtrage, classification, windows server]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-quotas-filtrage-classification|FSRM]].

## Installation et paramètres

```powershell
Install-WindowsFeature FS-Resource-Manager -IncludeManagementTools
Set-FsrmSetting -SmtpServer smtp.corp.exemple.fr -FromEmailAddress fsrm@exemple.fr -AdminEmailAddress stockage@exemple.fr
Send-FsrmTestEmail -ToEmailAddress stockage@exemple.fr
Get-FsrmSetting
```

## Quotas

```powershell
$seuil = New-FsrmQuotaThreshold -Percentage 85 -Action (New-FsrmAction -Type Email -MailTo "[Admin Email];[Source Io Owner Email]" -Subject "Quota à 85 %" -Body "Le dossier [Quota Path] atteint [Quota Used Percent] %.")
New-FsrmQuotaTemplate -Name "Dossier personnel 5 Go" -Size 5GB -Threshold $seuil
New-FsrmQuota -Path "D:\Partages\Reseau" -Size 200GB -SoftLimit:$false
New-FsrmAutoQuota -Path "D:\Personnels" -Template "Dossier personnel 5 Go"
Get-FsrmQuota | Format-Table Path, Size, Usage, SoftLimit
Set-FsrmQuota -Path "D:\Partages\Reseau" -Size 300GB
Reset-FsrmQuota -Path "D:\Partages\Reseau" -Template "Dossier personnel 5 Go"
dirquota quota list
```

## Filtrage de fichiers

```powershell
New-FsrmFileGroup -Name "Fichiers interdits" -IncludePattern @("*.exe", "*.iso", "*.mp4")
New-FsrmFileScreen -Path "D:\Partages\Reseau" -IncludeGroup "Fichiers interdits" -Active
New-FsrmFileScreenException -Path "D:\Partages\Reseau\Logiciels" -IncludeGroup "Fichiers interdits"
Get-FsrmFileScreen | Format-Table Path, Active, IncludeGroup
filescrn screen list
```

### Détection de rançongiciels (filtre passif + action)

```powershell
New-FsrmFileGroup -Name "Extensions rançongiciels" -IncludePattern @("*.locky", "*.encrypted", "*_HOW_TO_DECRYPT*", "*.crypt")
$evt = New-FsrmAction -Type Event -EventType Warning -Body "Fichier suspect [Source File Path] créé par [Source Io Owner]"
$cmd = New-FsrmAction -Type Command -Command "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -CommandParameters "-File C:\Scripts\bloquer-utilisateur.ps1 -Utilisateur [Source Io Owner]" -SecurityLevel LocalSystem -KillTimeOut 5
New-FsrmFileScreen -Path "D:\Partages" -IncludeGroup "Extensions rançongiciels" -Notification $evt, $cmd
```

## Classification et tâches

```powershell
New-FsrmClassificationPropertyDefinition -Name "Confidentialite" -Type SingleChoice -PossibleValue @((New-FsrmClassificationPropertyValue -Name "Public"), (New-FsrmClassificationPropertyValue -Name "Confidentiel"))
New-FsrmClassificationRule -Name "Confidentiel si IBAN" -Property "Confidentialite" -PropertyValue "Confidentiel" -Namespace @("D:\Partages\Finance") -ClassificationMechanism "Content Classifier" -ContentRegularExpression @("FR\d{2}\s?\d{4}")
Start-FsrmClassification
New-FsrmFileManagementJob -Name "Archiver anciens" -Namespace @("D:\Partages\Projets") -Action (New-FsrmFmjAction -Type Expiration -ExpirationFolder "E:\Archives") -Condition (New-FsrmFmjCondition -Property "File.DateLastModified" -Condition LessThan -Value "Date.Now" -DateOffset -730) -Schedule (New-FsrmScheduledTask -Time (Get-Date "02:00") -Monthly 1)
```

## Rapports

```powershell
New-FsrmStorageReport -Name "Gros fichiers" -Namespace @("D:\Partages") -ReportType LargeFiles -LargeFileMinimum 500MB -Interactive
Get-FsrmStorageReport
```

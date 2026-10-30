---
title: Quotas, filtrage de fichiers, classification et rapports
description: Gestionnaire de ressources du serveur de fichiers (FSRM) — installation, quotas stricts et souples, modèles et quotas automatiques, groupes de fichiers et filtrage (bloquer exécutables, médias, extensions de rançongiciels avec action de blocage du compte), notifications par courriel et événements, rapports de stockage, classification et tâches de gestion de fichiers, exportation de la configuration.
tags: [fsrm, quotas, filtrage de fichiers, rançongiciel, classification, rapports, windows server]
icon: scan-search
---

Le **Gestionnaire de ressources du serveur de fichiers** (FSRM) contrôle **combien** et **quoi** les utilisateurs stockent sur un serveur de fichiers Windows, classe les fichiers et produit des rapports.

```powershell
Install-WindowsFeature FS-Resource-Manager -IncludeManagementTools
# Console : fsrm.msc
Set-FsrmSetting -SmtpServer smtp.corp.exemple.fr -FromEmailAddress fsrm@corp.exemple.fr -AdminEmailAddress stockage@corp.exemple.fr
Send-FsrmTestEmail -ToEmailAddress stockage@corp.exemple.fr
```

## Quotas

| Type | Effet |
| --- | --- |
| **Strict** (*hard*) | Écriture refusée au-delà de la limite |
| **Souple** (*soft*) | Notification seulement (surveillance) |
| **Quota automatique** | Appliqué à chaque sous-dossier existant et futur (ex. un quota par dossier personnel) |

```powershell
New-FsrmQuotaTemplate -Name "Personnel 20 Go" -Size 20GB `
  -Threshold (New-FsrmQuotaThreshold -Percentage 90 -Action (New-FsrmAction -Type Email -MailTo "[Source Io Owner Email]" -Subject "Quota à 90 %" -Body "Votre dossier [Quota Path] utilise [Quota Used Percent] % de [Quota Limit MB] Mo."))
New-FsrmAutoQuota -Path D:\Partages\Personnels -Template "Personnel 20 Go"

New-FsrmQuota -Path D:\Partages\Compta -Size 500GB -SoftLimit -Description "Surveillance Compta"
Get-FsrmQuota | Format-Table Path, Size, Usage, SoftLimit
```

Les quotas FSRM s'appliquent **par dossier** (et non par utilisateur, contrairement aux quotas NTFS de volume).

## Filtrage de fichiers

```powershell
New-FsrmFileGroup -Name "Exécutables" -IncludePattern @("*.exe", "*.msi", "*.bat", "*.cmd", "*.ps1", "*.vbs", "*.js", "*.scr")
New-FsrmFileScreen -Path D:\Partages\Compta -IncludeGroup "Exécutables","Fichiers audio et vidéo" -Active `
  -Notification (New-FsrmAction -Type Event -EventType Warning -Body "[Source Io Owner] a tenté d'enregistrer [Source File Path] sur [File Screen Path].")
New-FsrmFileScreenException -Path D:\Partages\Compta\Outils -IncludeGroup "Exécutables"
```

| Mode | Effet |
| --- | --- |
| **Actif** | Enregistrement **bloqué** |
| Passif | Autorisé, mais notifié (audit) |

### Contre les rançongiciels

Un groupe de fichiers contenant les **extensions et noms de notes de rançon** connus (`*.locky`, `*.encrypted`, `*_readme*.txt`, `HOW_TO_DECRYPT*`…), en filtrage **passif** sur tous les partages, avec une action **commande** qui retire l'accès de l'utilisateur fautif :

```powershell
New-FsrmFileGroup -Name "Rançongiciels" -IncludePattern @("*.locky", "*.crypt", "*.encrypted", "*.enc", "*HOW_TO_DECRYPT*", "*DECRYPT_INSTRUCTIONS*", "*_readme_*.txt")
$cmd = New-FsrmAction -Type Command -Command "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" `
  -CommandParameters "-NoProfile -File C:\Scripts\Bloquer-Utilisateur.ps1 -Utilisateur [Source Io Owner]" -SecurityLevel LocalSystem -KillTimeOut 2
New-FsrmFileScreen -Path D:\Partages -IncludeGroup "Rançongiciels" -Notification $cmd, (New-FsrmAction -Type Email -MailTo "[Admin Email]" -Subject "ALERTE rançongiciel" -Body "[Source Io Owner] — [Source File Path]")
```

```powershell C:\Scripts\Bloquer-Utilisateur.ps1
param([string]$Utilisateur)
# Refuser l'accès SMB à l'utilisateur sur tous les partages non spéciaux
Get-SmbShare -Special $false | ForEach-Object { Block-SmbShareAccess -Name $_.Name -AccountName $Utilisateur -Force }
Write-EventLog -LogName Application -Source "SRMSVC" -EventId 9999 -EntryType Warning -Message "Accès SMB bloqué pour $Utilisateur (détection FSRM)."
```

Ce mécanisme ne remplace ni l'EDR ni des sauvegardes immuables : les nouvelles familles utilisent des extensions aléatoires. Il limite seulement les dégâts des variantes connues. Maintenez la liste (sources publiques) et surveillez les blocages.

## Rapports de stockage

```powershell
New-FsrmStorageReport -Name "Rapport mensuel" -Namespace @("D:\Partages") -ReportType @("LargeFiles", "DuplicateFiles", "LeastRecentlyAccessed", "FilesByOwner", "QuotaUsage") `
  -Schedule (New-FsrmScheduledTask -Time (Get-Date "2026-11-01 06:00") -Monthly 1) -MailTo "stockage@corp.exemple.fr" -ReportFormat DHTML
Start-FsrmStorageReport -Name "Rapport mensuel"
```

Les rapports (gros fichiers, doublons, fichiers jamais ouverts, par propriétaire) servent à **nettoyer** avant d'acheter du stockage, et à préparer les migrations.

## Classification et tâches de gestion

| Fonction | Exemple |
| --- | --- |
| **Propriétés de classification** | `Confidentialité` = Public / Interne / Confidentiel |
| Règles | Par dossier (tout `D:\Partages\RH` → Confidentiel) ou par contenu (expression régulière : numéros de sécurité sociale, IBAN) |
| **Tâches de gestion de fichiers** | Déplacer vers une archive les fichiers non modifiés depuis 3 ans ; appliquer le chiffrement RMS ; expirer des fichiers temporaires |
| Contrôle d'accès dynamique | Les propriétés alimentent des règles d'accès centralisées (AD) |

```powershell
New-FsrmClassificationPropertyDefinition -Name "Confidentialite" -Type SingleChoice -PossibleValue @(
  (New-FsrmClassificationPropertyValue -Name "Public"), (New-FsrmClassificationPropertyValue -Name "Interne"), (New-FsrmClassificationPropertyValue -Name "Confidentiel"))
New-FsrmClassificationRule -Name "RH confidentiel" -Property "Confidentialite" -PropertyValue "Confidentiel" -Namespace @("D:\Partages\RH") -ClassificationMechanism "Folder Classifier" -ReevaluateProperty Overwrite
Start-FsrmClassification
```

## Export, journaux, dépannage

```powershell
# Exporter/importer les modèles (migration, second serveur)
filescrn template export /file:D:\fsrm\filtres.xml
dirquota template export /file:D:\fsrm\quotas.xml
dirquota template import /file:D:\fsrm\quotas.xml
```

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Pas de courriel | SMTP, relais refusé | `Send-FsrmTestEmail`, autoriser le serveur sur le relais |
| Courriels limités | Limites de notification (1 par heure par défaut) | *Paramètres → Limites de notification* |
| Quota incorrect après restauration | Recalcul en cours | `Update-FsrmQuota`, attendre l'analyse |
| Filtrage contourné | Renommage d'extension | Filtrage par contenu impossible : compléter par l'EDR et les droits |
| Événements | *Application* (source **SRMSVC**, 8215 filtrage, 12325 quota) | Envoyer au SIEM |

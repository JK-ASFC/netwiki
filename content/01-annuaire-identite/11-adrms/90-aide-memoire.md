---
title: AD RMS — aide-mémoire des commandes
description: Commandes AD RMS avec exemples — installation du rôle, lecteur PowerShell AdRmsAdmin (modèles, super-utilisateurs), vérification des points de terminaison et du point de connexion de service, sauvegarde des bases SQL, client (cache de licences, découverte), journaux, et migration vers Microsoft Purview (AIPService, import du domaine de publication approuvé).
tags: [aide-mémoire, ad rms, rms, protection, powershell, purview]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-deploiement|AD RMS]]. AD RMS est un rôle hérité : Microsoft oriente vers **Microsoft Purview Information Protection**.

## Installation

```powershell
Install-WindowsFeature ADRMS -IncludeManagementTools
# La configuration de la grappe se fait ensuite dans le Gestionnaire de serveur (assistant post-déploiement)
Get-WindowsFeature ADRMS*
```

## Lecteur PowerShell AdRmsAdmin

```powershell
Import-Module AdRmsAdmin
New-PSDrive -Name RMS -PSProvider AdRmsAdmin -Root https://rms.corp.exemple.fr
Get-ChildItem RMS:\
Get-ChildItem RMS:\RightsPolicyTemplate | Select-Object DefaultDisplayName, Id
# Super-utilisateurs (lecture de tout contenu protégé, ex. pour l'eDiscovery)
Set-ItemProperty -Path RMS:\SecurityPolicy\SuperUser -Name IsEnabled -Value $true
Set-ItemProperty -Path RMS:\SecurityPolicy\SuperUser -Name SuperUserGroup -Value "rms-superusers@corp.exemple.fr"
Get-ItemProperty -Path RMS:\SecurityPolicy\SuperUser
```

## Côté client

```powershell
# Effacer le cache de licences RMS de l'utilisateur
Remove-Item "$env:LOCALAPPDATA\Microsoft\MSIPC\*" -Recurse -Force
# Clés de découverte du service (si pas de point de connexion de service dans l'AD)
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\MSIPC\ServiceLocation\EnterpriseCertification" -ErrorAction SilentlyContinue
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\MSIPC\ServiceLocation\EnterprisePublishing" -ErrorAction SilentlyContinue
```

## Tests et journaux

```powershell
Invoke-WebRequest https://rms.corp.exemple.fr/_wmcs/certification/certification.asmx -UseDefaultCredentials -UseBasicParsing | Select-Object StatusCode
Get-WinEvent -LogName "Active Directory Rights Management Services" -MaxEvents 20 -ErrorAction SilentlyContinue
# Outil Microsoft « RMS Analyzer » pour diagnostiquer un client
```

## Vérifications de la grappe

```powershell
# Points de terminaison IIS publiés par AD RMS
Get-WebApplication -Site "Default Web Site" | Where-Object Path -like "/_wmcs*" | Select-Object Path, PhysicalPath
Invoke-WebRequest https://rms.corp.exemple.fr/_wmcs/licensing/license.asmx -UseDefaultCredentials -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest https://rms.corp.exemple.fr/_wmcs/licensing/publish.asmx -UseDefaultCredentials -UseBasicParsing | Select-Object StatusCode
# Point de connexion de service publié dans Active Directory
Get-ADObject -SearchBase "CN=RightsManagementServices,CN=Services,$((Get-ADRootDSE).configurationNamingContext)" -Filter * -Properties serviceBindingInformation | Select-Object Name, serviceBindingInformation
```

## Bases de données

```powershell
Import-Module SqlServer
Get-SqlDatabase -ServerInstance srv-sql.corp.exemple.fr | Where-Object Name -like "DRMS*" | Select-Object Name, Size
Get-SqlDatabase -ServerInstance srv-sql.corp.exemple.fr | Where-Object Name -like "DRMS*" | ForEach-Object { Backup-SqlDatabase -ServerInstance srv-sql.corp.exemple.fr -Database $_.Name -BackupFile "E:\Sauvegardes\$($_.Name)-$(Get-Date -Format yyyy-MM-dd).bak" }
```

Conservez aussi le **domaine de publication approuvé** exporté (fichier `.xml` protégé par mot de passe) et le mot de passe du cluster : sans eux, le contenu protégé ne peut plus être déchiffré après une reconstruction.

## Migration vers Microsoft Purview (Azure RMS)

```powershell
Install-Module AIPService
Connect-AipService
Get-AipServiceConfiguration
# Importer le domaine de publication approuvé exporté depuis AD RMS (clé gérée par Microsoft)
Import-AipServiceTpd -TpdFile C:\Temp\TPD-corp.xml -ProtectionPassword (Read-Host -AsSecureString "Mot de passe du TPD") -Active $true -Verbose
Get-AipServiceKeys
Enable-AipService
```

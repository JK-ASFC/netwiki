---
title: AD RMS — aide-mémoire des commandes
description: Commandes AD RMS avec exemples — installation du rôle, provider PowerShell AdRmsAdmin (lecteur RMS, modèles de stratégie, super-utilisateurs), modèles de droits, groupe de super-utilisateurs, emplacements de configuration côté client (registre, RMS Analyzer), tests et journaux, migration vers Azure Information Protection / Purview.
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

---
title: Windows Admin Center — aide-mémoire des commandes
description: Commandes Windows Admin Center avec exemples — installation silencieuse (msiexec, port, certificat), service et mise à jour, module PowerShell de la passerelle (connexions, extensions, export/import), contrôle d'accès (groupes d'utilisateurs et d'administrateurs de la passerelle), délégation Kerberos RBCD vers les serveurs gérés, journaux et dépannage.
tags: [aide-mémoire, windows admin center, wac, passerelle, powershell, msiexec]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Windows Admin Center]].

## Installation

```powershell
# Installation silencieuse (version MSI) sur le port 443 avec un certificat existant
msiexec /i WindowsAdminCenter.msi /qn /L*v wac-install.log SME_PORT=443 SME_THUMBPRINT=A1B2C3D4E5F6... SSL_CERTIFICATE_OPTION=installed
# Certificat autosigné (tests uniquement)
msiexec /i WindowsAdminCenter.msi /qn SME_PORT=443 SSL_CERTIFICATE_OPTION=generate
Get-Service ServerManagementGateway, WindowsAdminCenter -ErrorAction SilentlyContinue
```

(Les versions récentes, à partir de 2410, utilisent un nouvel installeur `.exe` avec des options équivalentes et le service `WindowsAdminCenter`.)

## Module PowerShell de la passerelle

```powershell
Import-Module "$env:ProgramFiles\Windows Admin Center\PowerShell\Modules\ConnectionTools"
Import-Module "$env:ProgramFiles\Windows Admin Center\PowerShell\Modules\ExtensionTools"
# Exporter / importer la liste des connexions
Export-Connection "https://wac.corp.exemple.fr" -FileName C:\Temp\connexions.csv
Import-Connection "https://wac.corp.exemple.fr" -FileName C:\Temp\connexions.csv
# Extensions
Get-Extension "https://wac.corp.exemple.fr" | Select-Object id, version, status
Install-Extension "https://wac.corp.exemple.fr" msft.sme.containers
Update-Extension "https://wac.corp.exemple.fr" msft.sme.containers
```

Format du CSV de connexions : `name,type,tags,groupId` (type `msft.sme.connection-type.server` ou `.cluster`).

## Contrôle d'accès

Dans *Paramètres → Accès* : groupes AD autorisés comme **utilisateurs de la passerelle** et **administrateurs de la passerelle**, authentification par carte à puce ou Entra ID possible. Limitez l'accès réseau au port de WAC depuis le réseau d'administration.

## Délégation Kerberos (éviter les invites d'identifiants)

```powershell
$wac = Get-ADComputer wac01
Get-ADComputer -Filter "Name -like 'srv-*'" | ForEach-Object { Set-ADComputer $_ -PrincipalsAllowedToDelegateToAccount $wac }
Get-ADComputer srv-web01 -Properties PrincipalsAllowedToDelegateToAccount
```

## Dépannage

```powershell
Get-WinEvent -LogName "Microsoft-ServerManagementExperience" -MaxEvents 20 -ErrorAction SilentlyContinue
Test-NetConnection wac.corp.exemple.fr -Port 443
Test-WSMan srv-web01                       # WAC utilise WinRM vers les serveurs gérés
netsh http show sslcert ipport=0.0.0.0:443
```

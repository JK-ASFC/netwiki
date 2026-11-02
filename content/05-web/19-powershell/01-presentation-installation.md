---
title: Présentation, installation et utilisation
description: PowerShell 7 — shell objet et langage d'automatisation libre (MIT) sur .NET : différences avec Windows PowerShell 5.1, versions LTS, installation Windows (winget, MSI, Microsoft Store), Ubuntu et Debian (dépôt Microsoft), RHEL, Alpine, macOS, Docker et Snap, coexistence avec 5.1, modules (PSResourceGet, Install-PSResource, PowerShell Gallery, dépôt interne), profils, gestion à distance par SSH (sous-système pwsh dans sshd_config, Enter-PSSession, Invoke-Command), compatibilité Windows, politique d'exécution et journalisation.
tags: [powershell, pwsh, automatisation, linux, ssh, modules, scripts]
icon: info
---

**PowerShell 7** (`pwsh`) est la version libre et multiplate-forme du shell de Microsoft. Elle coexiste avec **Windows PowerShell 5.1** (`powershell.exe`, intégré à Windows, figé) sans le remplacer. Les versions **LTS** (paires : 7.4, 7.6…) suivent le support de la version .NET sous-jacente.

| | Windows PowerShell 5.1 | **PowerShell 7** |
| --- | --- | --- |
| Plates-formes | Windows | Windows, Linux, macOS |
| Moteur | .NET Framework | .NET moderne |
| Nouveautés | Aucune | `ForEach-Object -Parallel`, opérateurs `??`, `?.`, `&&`, `\|\|`, `ConvertFrom-Json -AsHashtable`, SSH natif |
| Modules Windows | Tous | La plupart (compatibilité Windows pour le reste) |

## Installation

| Système | Commande |
| --- | --- |
| Windows | `winget install Microsoft.PowerShell` (ou MSI, Microsoft Store) |
| Ubuntu/Debian | Dépôt Microsoft (`packages-microsoft-prod.deb`) puis `sudo apt install powershell` |
| RHEL/Rocky/Alma | `sudo dnf install https://packages.microsoft.com/config/rhel/9/packages-microsoft-prod.rpm` puis `sudo dnf install powershell` |
| Alpine, autres | Archive `.tar.gz` depuis les versions GitHub |
| macOS | `brew install --cask powershell` |
| Snap / Docker | `sudo snap install powershell --classic` ; image `mcr.microsoft.com/powershell` |

```bash
# Ubuntu 24.04
source /etc/os-release
wget -q "https://packages.microsoft.com/config/ubuntu/${VERSION_ID}/packages-microsoft-prod.deb"
sudo dpkg -i packages-microsoft-prod.deb && sudo apt update && sudo apt install -y powershell
pwsh -NoLogo -Command '$PSVersionTable'
```

## Modules

```powershell
Get-Module -ListAvailable
Find-PSResource -Name Az.Accounts -Repository PSGallery
Install-PSResource -Name Pester, PSScriptAnalyzer -Scope CurrentUser -TrustRepository
Update-PSResource -Name Pester
Register-PSResourceRepository -Name Interne -Uri https://nuget.corp.exemple.fr/v3/index.json -Trusted
# Module Windows non compatible : chargé dans une session 5.1 cachée
Import-Module ServerManager -UseWindowsPowerShell
```

`Install-Module` (PowerShellGet v2) fonctionne toujours ; **PSResourceGet** (`*-PSResource`) le remplace.

## Gestion à distance par SSH

```bash
# Sur le serveur Linux : déclarer PowerShell comme sous-système SSH
echo 'Subsystem powershell /usr/bin/pwsh -sshs -NoLogo' | sudo tee /etc/ssh/sshd_config.d/50-powershell.conf
sudo systemctl reload ssh      # « sshd » sur RHEL
```

Sous Windows, même ligne dans `C:\ProgramData\ssh\sshd_config` (chemin court vers `pwsh.exe`, par exemple `c:/progra~1/powershell/7/pwsh.exe`) avec [[01-openssh/01-presentation|OpenSSH Server]].

```powershell
Enter-PSSession -HostName srv-lin-01.corp.exemple.fr -UserName adm-jk
Invoke-Command -HostName srv-lin-01, srv-lin-02 -UserName adm-jk -ScriptBlock { uptime }
$s = New-PSSession -HostName srv-lin-01 -UserName adm-jk -KeyFilePath ~/.ssh/id_ed25519
Copy-Item ./script.ps1 -Destination /tmp/ -ToSession $s
```

WinRM reste disponible entre machines Windows ([[09-winrm/01-presentation-configuration|WinRM]]).

## Bonnes pratiques

- Profil : `$PROFILE` (`notepad $PROFILE` / `code $PROFILE`) pour alias et modules usuels.
- Qualité : `Invoke-ScriptAnalyzer -Path . -Recurse`, tests **Pester**.
- Sécurité Windows : politique d'exécution `RemoteSigned` ou `AllSigned`, journalisation des blocs de script (GPO « Activer la journalisation de blocs de scripts PowerShell » existe aussi pour PowerShell 7 via ses modèles ADMX).
- Configuration déclarative des serveurs : [[05-powershell-dsc/01-presentation-configurations|PowerShell DSC]].

Commandes : [[90-aide-memoire|aide-mémoire]].

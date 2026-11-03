---
title: OpenSSH pour Windows et PowerToys
description: Win32-OpenSSH (client et serveur SSH de Microsoft : fonctionnalité facultative Add-WindowsCapability ou MSI GitHub, service sshd, sshd_config dans ProgramData, clés et administrators_authorized_keys, PowerShell 7 comme shell par défaut, pare-feu, SFTP, distant PowerShell par SSH) et PowerToys (MIT : FancyZones, Command Palette, PowerRename, éditeur du fichier hosts, variables d'environnement, Text Extractor, Awake, Mouse Without Borders, File Locksmith ; déploiement winget et stratégies de groupe).
tags: [windows, openssh, sshd, powershell, powertoys, administration]
icon: key-round
---

## OpenSSH pour Windows

Client installé par défaut sur Windows 10/11 et Server 2019+. Le **serveur** est une fonctionnalité facultative (ou un MSI publié sur GitHub par le projet PowerShell/Win32-OpenSSH, plus récent) :

```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
Get-NetFirewallRule -Name *OpenSSH* | Select-Object Name, Enabled     # règle créée pour le port 22
```

Configuration dans `C:\ProgramData\ssh\sshd_config` (redémarrer `sshd` après modification) :

```text
PasswordAuthentication no
PubkeyAuthentication yes
AllowGroups "corp\admins-serveurs" administrators
Subsystem sftp sftp-server.exe
Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

Pour un **administrateur**, la clé publique va dans `C:\ProgramData\ssh\administrators_authorized_keys` (et non dans le profil), avec des droits restreints :

```powershell
icacls.exe "C:\ProgramData\ssh\administrators_authorized_keys" /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Program Files\PowerShell\7\pwsh.exe" -PropertyType String -Force
```

PowerShell 7 peut ensuite servir de **distant par SSH** (`Enter-PSSession -HostName srv01 -UserName jk` après avoir ajouté `Subsystem powershell c:/progra~1/powershell/7/pwsh.exe -sshs -NoLogo` dans `sshd_config`). Voir [[01-openssh/01-presentation|OpenSSH]] et [[19-powershell/01-presentation-installation|PowerShell 7]].

## PowerToys

`winget install --id Microsoft.PowerToys -e` (Windows 10/11). Modules utiles à l'administrateur :

| Module | Usage |
| --- | --- |
| **Command Palette** / PowerToys Run | Lanceur rapide (`Win+Alt+Espace` / `Alt+Espace`) |
| **FancyZones** | Dispositions de fenêtres sur grand écran |
| **PowerRename** | Renommage en masse avec expressions régulières |
| **Éditeur du fichier hosts** | Modifier `hosts` sans Bloc-notes administrateur |
| **Variables d'environnement** | Éditeur avec profils |
| **Text Extractor** | OCR d'une zone de l'écran (`Win+Maj+T`) |
| **File Locksmith** | Quel processus verrouille ce fichier ? |
| **Awake** | Empêcher la mise en veille pendant une longue opération |
| **Mouse Without Borders** | Une souris et un clavier pour plusieurs PC |

En entreprise, les modèles **ADMX** de PowerToys permettent d'activer ou de désactiver chaque module par stratégie de groupe ou Intune.

Commandes : [[90-aide-memoire|aide-mémoire]].

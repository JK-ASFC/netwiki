---
title: PowerShell 7 — aide-mémoire des commandes
description: Commandes PowerShell 7 avec exemples — version, aide (Get-Help, Get-Command, Get-Member), pipeline objet (Where-Object, Select-Object, Sort-Object, Group-Object, ForEach-Object -Parallel), fichiers, JSON et CSV, réseau (Test-Connection, Test-NetConnection, Invoke-RestMethod), services et processus, modules PSResourceGet, sessions SSH, jobs, gestion d'erreurs, opérateurs de PowerShell 7.
tags: [aide-mémoire, powershell, pwsh]
icon: terminal
---

Explications : [[01-presentation-installation|PowerShell 7]].

```powershell
$PSVersionTable ; Update-Help -UICulture en-US -ErrorAction SilentlyContinue
Get-Help Get-Process -Examples ; Get-Command -Noun Service ; Get-Process | Get-Member
Get-Process | Where-Object CPU -gt 100 | Sort-Object CPU -Descending | Select-Object -First 5 Name, Id, CPU
Get-ChildItem -Recurse -Filter *.log | Group-Object Extension | Select-Object Name, Count
1..50 | ForEach-Object -Parallel { Test-Connection "10.0.20.$_" -Count 1 -Quiet } -ThrottleLimit 20
Get-Content conf.json | ConvertFrom-Json -AsHashtable
Import-Csv postes.csv | Export-Csv -Path postes-fr.csv -Delimiter ';' -NoTypeInformation
Invoke-RestMethod -Uri https://netbox.corp.exemple.fr/api/dcim/sites/ -Headers @{ Authorization = "Token $env:NB_TOKEN" }
Test-Connection srv-web-01 -Count 2 ; Test-NetConnection srv-web-01 -Port 443   # Windows
Get-Service | Where-Object Status -eq Running ; Restart-Service Spooler       # Windows
Start-Job { Get-ChildItem C:\ -Recurse } | Receive-Job -Wait
try { Get-Item X:\absent -ErrorAction Stop } catch { Write-Warning $_.Exception.Message }
$valeur = $env:PROXY ?? 'aucun' ; Get-Item /etc/hosts && Write-Host 'présent'
Enter-PSSession -HostName srv-lin-01 -UserName adm-jk ; Get-PSSession | Remove-PSSession
Find-PSResource Microsoft.Graph -Repository PSGallery ; Install-PSResource PSScriptAnalyzer -Scope CurrentUser
```

## Installation

```bash
winget install Microsoft.PowerShell                  # Windows
sudo apt install powershell                          # Ubuntu / Debian (dépôt Microsoft packages-microsoft-prod)
sudo dnf install powershell                          # RHEL (dépôt Microsoft)
brew install --cask powershell                       # macOS
pwsh -Version
```

## Administration à distance

```powershell
# WinRM (Windows)
Enable-PSRemoting -Force
Invoke-Command -ComputerName srv-win-01, srv-win-02 -ScriptBlock { Get-Service W32Time }
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "srv-hors-domaine.exemple.fr" -Concatenate
# SSH (Linux, macOS, Windows) : dans sshd_config de la cible
#   Subsystem powershell /usr/bin/pwsh -sshs -NoLogo
Invoke-Command -HostName srv-lin-01 -UserName adm-jk -ScriptBlock { uname -a }
```

## Sécurité des scripts et secrets

```powershell
Get-ExecutionPolicy -List
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
Install-PSResource PSScriptAnalyzer -Scope CurrentUser
Invoke-ScriptAnalyzer -Path . -Recurse
Set-AuthenticodeSignature -FilePath .\deploiement.ps1 -Certificate (Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert | Select-Object -First 1)
Start-Transcript -Path "C:\Journaux\session-$(Get-Date -Format yyyyMMdd-HHmm).txt"
# Coffre de secrets local
Install-PSResource Microsoft.PowerShell.SecretManagement, Microsoft.PowerShell.SecretStore -Scope CurrentUser
Register-SecretVault -Name Coffre -ModuleName Microsoft.PowerShell.SecretStore -DefaultVault
Set-Secret -Name ApiNetbox -Secret 'jeton-netbox'
Get-Secret -Name ApiNetbox -AsPlainText
```

## Tâche planifiée (Windows)

```powershell
$action = New-ScheduledTaskAction -Execute "pwsh.exe" -Argument "-NoProfile -File C:\Scripts\inventaire.ps1"
$declencheur = New-ScheduledTaskTrigger -Daily -At 6am
Register-ScheduledTask -TaskName "Inventaire quotidien" -Action $action -Trigger $declencheur -User "CORP\gmsa-scripts$" -RunLevel Highest
```

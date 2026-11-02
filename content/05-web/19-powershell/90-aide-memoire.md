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

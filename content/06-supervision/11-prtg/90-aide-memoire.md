---
title: PRTG — aide-mémoire des commandes
description: Commandes et API PRTG Network Monitor avec exemples — services Windows du serveur central et des sondes, API HTTP (table.json pour capteurs et appareils, état, pause/reprise, vérification immédiate, acquittement, historique), jetons d'API, module PowerShell PrtgAPI, capteurs EXE/Script avancés (format de sortie JSON/XML), sauvegarde de la configuration, ports et journaux.
tags: [aide-mémoire, prtg, paessler, api, powershell, supervision]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|PRTG]].

## Services Windows

```powershell
Get-Service PRTGCoreService, PRTGProbeService | Format-Table Name, Status
Restart-Service PRTGProbeService
Get-ChildItem "C:\ProgramData\Paessler\PRTG Network Monitor\Logs\core" | Sort-Object LastWriteTime | Select-Object -Last 3
```

## API HTTP

```powershell
$P = "https://prtg.exemple.fr"
$A = "apitoken=$env:PRTG_TOKEN"            # jeton d'API (versions récentes) ; sinon username=…&passhash=…
# Capteurs en erreur
Invoke-RestMethod "$P/api/table.json?content=sensors&columns=objid,device,sensor,status,message&filter_status=5&$A" | Select-Object -ExpandProperty sensors
# Appareils
Invoke-RestMethod "$P/api/table.json?content=devices&columns=objid,device,host,group&$A" | Select-Object -ExpandProperty devices
# Mettre en pause un appareil 60 minutes, puis reprendre
Invoke-RestMethod "$P/api/pauseobjectfor.htm?id=2045&pausemsg=Maintenance&duration=60&$A"
Invoke-RestMethod "$P/api/pause.htm?id=2045&action=1&$A"
# Vérifier immédiatement
Invoke-RestMethod "$P/api/scannow.htm?id=2045&$A"
# Acquitter une alarme
Invoke-RestMethod "$P/api/acknowledgealarm.htm?id=3120&ackmsg=Pris%20en%20charge&$A"
# Historique d'un capteur
Invoke-RestMethod "$P/api/historicdata.json?id=3120&avg=3600&sdate=2026-10-28-00-00-00&edate=2026-10-29-00-00-00&$A"
```

## Module PrtgAPI (communautaire)

```powershell
Install-Module PrtgAPI -Scope CurrentUser
Connect-PrtgServer prtg.exemple.fr (Get-Credential) -Force
Get-Sensor -Status Down | Select-Object Device, Name, Message
Get-Device srv-web01 | Suspend-Object -Duration 60 -Message "Maintenance"
Get-Device srv-web01 | Resume-Object
Get-Probe | Select-Object Name, Status
```

## Capteur EXE/Script avancé (sortie JSON)

```powershell
# C:\Program Files (x86)\PRTG Network Monitor\Custom Sensors\EXEXML\file-attente.ps1
$n = (Get-ChildItem \\nas\depot\entrant).Count
@{ prtg = @{ result = @(@{ channel = "Fichiers en attente"; value = $n; limitmode = 1; limitmaxwarning = 50; limitmaxerror = 200 }) } } | ConvertTo-Json -Depth 5
```

## Sauvegarde et ports

- Configuration : `C:\ProgramData\Paessler\PRTG Network Monitor\PRTG Configuration.dat` (sauvegardes automatiques dans `Configuration Auto-Backups`), plus les données historiques (`Monitoring Database`).
- Ports : 443 (interface web), 23560 (connexion des sondes distantes au serveur central).

---
title: OpenEDR et télémétrie Windows — aide-mémoire
description: Commandes utiles autour d'un EDR sous Windows — état des services et pilotes de l'agent (Get-Service, sc query, fltmc), installation silencieuse MSI, Sysmon (installation avec configuration, mise à jour, désinstallation, lecture des événements), et vérifications de Microsoft Defender (Get-MpComputerStatus), avec exemples.
tags: [aide-mémoire, openedr, sysmon, edr, windows, powershell]
icon: terminal
---

Explications : [[01-presentation-installation|OpenEDR]].

```powershell
Get-Service | Where-Object DisplayName -match 'EDR|Xcitium|Comodo' ; fltmc filters ; sc.exe query type= driver | findstr /i edr
msiexec /i agent-edr.msi /qn /l*v C:\Temp\edr-install.log
Sysmon64.exe -accepteula -i sysmonconfig.xml ; Sysmon64.exe -c sysmonconfig-nouvelle.xml ; Sysmon64.exe -u
Get-WinEvent -LogName 'Microsoft-Windows-Sysmon/Operational' -MaxEvents 20 | Format-Table TimeCreated, Id, Message -Wrap
Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-Sysmon/Operational'; Id = 3 } -MaxEvents 50     # connexions réseau
Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled, AntivirusSignatureLastUpdated
```

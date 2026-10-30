---
title: Impression (CUPS et serveur d'impression Windows) — aide-mémoire des commandes
description: Commandes d'impression avec exemples — CUPS (lpstat, lpadmin : ajout d'imprimantes IPP Everywhere, pilotes, options, partage, droits ; lp, lpq, cancel, cupsenable/cupsaccept, cupsctl), découverte (driverless, avahi), journaux ; serveur d'impression Windows (Add-Printer, Add-PrinterPort, Add-PrinterDriver, Get-PrintJob, printbrm sauvegarde/migration, Point and Print, spouleur).
tags: [aide-mémoire, cups, lpadmin, ipp, impression, windows print server, printbrm]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-cups-presentation-installation|impression]].

## CUPS : imprimantes

```bash
lpstat -t                                  # tout l'état
lpstat -p -d                               # imprimantes et imprimante par défaut
lpinfo -v                                  # périphériques détectés
driverless                                 # imprimantes IPP Everywhere sur le réseau
sudo lpadmin -p copieur-rdc -E -v ipp://10.0.50.21/ipp/print -m everywhere -D "Copieur RDC" -L "Paris RDC"
sudo lpadmin -p etiquettes -E -v socket://10.0.50.30:9100 -m drv:///sample.drv/generic.ppd
sudo lpadmin -d copieur-rdc                # imprimante par défaut
sudo lpadmin -p copieur-rdc -o sides-default=two-sided-long-edge -o print-color-mode-default=monochrome
sudo lpadmin -p copieur-rdc -u allow:@compta,amartin          # restreindre l'accès
sudo lpadmin -p copieur-rdc -o printer-is-shared=true
sudo lpadmin -x ancienne-imprimante
lpoptions -p copieur-rdc -l                # options disponibles
```

## CUPS : travaux

```bash
lp -d copieur-rdc -n 2 -o sides=two-sided-long-edge rapport.pdf
lpq -P copieur-rdc
lpstat -o
cancel copieur-rdc-42
cancel -a copieur-rdc
sudo cupsdisable copieur-rdc && sudo cupsenable copieur-rdc     # suspendre / reprendre
sudo cupsreject copieur-rdc && sudo cupsaccept copieur-rdc
lpmove copieur-rdc-43 copieur-etage1
```

## CUPS : serveur

```bash
sudo cupsctl --share-printers --remote-admin=no --remote-any=no
sudo cupsctl --debug-logging                 # puis --no-debug-logging
sudo systemctl restart cups
sudo tail -f /var/log/cups/error_log /var/log/cups/access_log
```

## Serveur d'impression Windows

```powershell
Install-WindowsFeature Print-Server -IncludeManagementTools
Add-PrinterDriver -Name "Microsoft IPP Class Driver"
Add-PrinterPort -Name "IP_10.0.50.21" -PrinterHostAddress "10.0.50.21"
Add-Printer -Name "Copieur-RDC" -DriverName "Microsoft IPP Class Driver" -PortName "IP_10.0.50.21" -Shared -ShareName "Copieur-RDC" -Location "Paris RDC" -Published
Get-Printer | Format-Table Name, DriverName, PortName, Shared, PrinterStatus
Get-PrintJob -PrinterName "Copieur-RDC"
Remove-PrintJob -PrinterName "Copieur-RDC" -ID 12
Set-PrintConfiguration -PrinterName "Copieur-RDC" -DuplexingMode TwoSidedLongEdge -Color $false
Restart-Service Spooler
# Sauvegarde / migration de toutes les files
& "$env:windir\System32\spool\tools\PrintBrm.exe" -b -s \\srv-print01 -f C:\Temp\impression.printerExport
& "$env:windir\System32\spool\tools\PrintBrm.exe" -r -s \\srv-print02 -f C:\Temp\impression.printerExport
```

```powershell
# Poste client
Add-Printer -ConnectionName "\\srv-print01\Copieur-RDC"
Get-Printer | Where-Object Type -eq Connection
```

## Sécurité

- Spouleur désactivé sur les serveurs qui n'impriment pas, notamment les **contrôleurs de domaine** (`Stop-Service Spooler; Set-Service Spooler -StartupType Disabled`) — leçon des vulnérabilités PrintNightmare.
- Point and Print restreint aux serveurs approuvés, installation de pilotes réservée aux administrateurs.

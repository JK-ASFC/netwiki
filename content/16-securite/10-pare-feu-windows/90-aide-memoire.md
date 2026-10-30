---
title: Pare-feu Windows — aide-mémoire des commandes
description: Commandes du pare-feu Windows Defender avec exemples — profils (Get/Set-NetFirewallProfile), règles entrantes et sortantes (New-NetFirewallRule par port, programme, service, adresse), consultation des règles et de leurs filtres, activation/désactivation, journalisation des paquets rejetés, IPsec (règles de sécurité de connexion), netsh advfirewall, export/import, GPO, tests.
tags: [aide-mémoire, pare-feu windows, netfirewallrule, netsh advfirewall, powershell]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-profils-regles|pare-feu Windows]].

## Profils

```powershell
Get-NetFirewallProfile | Format-Table Name, Enabled, DefaultInboundAction, DefaultOutboundAction, LogBlocked
Set-NetFirewallProfile -Profile Domain, Private, Public -Enabled True -DefaultInboundAction Block -DefaultOutboundAction Allow
Set-NetFirewallProfile -Profile Domain, Private, Public -LogBlocked True -LogMaxSizeKilobytes 16384 -LogFileName "%SystemRoot%\System32\LogFiles\Firewall\pfirewall.log"
Get-NetConnectionProfile                                # profil réseau des interfaces
Set-NetConnectionProfile -InterfaceAlias "Ethernet" -NetworkCategory Private
```

## Règles

```powershell
New-NetFirewallRule -DisplayName "SNMP supervision" -Direction Inbound -Protocol UDP -LocalPort 161 -RemoteAddress 10.0.98.10 -Action Allow -Profile Domain
New-NetFirewallRule -DisplayName "Appli métier" -Direction Inbound -Program "C:\Program Files\Appli\serveur.exe" -Action Allow
New-NetFirewallRule -DisplayName "Bloquer SMB sortant Internet" -Direction Outbound -Protocol TCP -RemotePort 445 -RemoteAddress Internet -Action Block
New-NetFirewallRule -DisplayName "RDP admin" -Direction Inbound -Protocol TCP -LocalPort 3389 -RemoteAddress 10.0.99.0/24 -Action Allow
Get-NetFirewallRule -DisplayGroup "Bureau à distance" | Enable-NetFirewallRule
Disable-NetFirewallRule -DisplayName "Appli métier"
Set-NetFirewallRule -DisplayName "RDP admin" -RemoteAddress 10.0.99.0/24, 10.0.98.5
Remove-NetFirewallRule -DisplayName "Ancienne règle"
# Consulter les règles actives entrantes avec leurs ports
Get-NetFirewallRule -Enabled True -Direction Inbound | ForEach-Object {
  $p = $_ | Get-NetFirewallPortFilter; $a = $_ | Get-NetFirewallAddressFilter
  [pscustomobject]@{ Nom = $_.DisplayName; Action = $_.Action; Proto = $p.Protocol; Port = $p.LocalPort; Distant = $a.RemoteAddress }
} | Format-Table -AutoSize
Get-NetFirewallRule -PolicyStore ActiveStore | Measure-Object       # règles effectives (y compris GPO)
```

## netsh advfirewall

```powershell
netsh advfirewall show allprofiles
netsh advfirewall firewall add rule name="Zabbix agent" dir=in action=allow protocol=TCP localport=10050 remoteip=10.0.98.20
netsh advfirewall firewall show rule name="Zabbix agent" verbose
netsh advfirewall firewall delete rule name="Zabbix agent"
netsh advfirewall export "C:\Temp\pare-feu.wfw"
netsh advfirewall import "C:\Temp\pare-feu.wfw"
netsh advfirewall reset                              # retour aux valeurs par défaut (prudence à distance)
```

## IPsec (sécurité de connexion)

```powershell
New-NetIPsecRule -DisplayName "Exiger l'authentification vers les serveurs d'administration" -InboundSecurity Require -OutboundSecurity Request -RemoteAddress 10.0.99.0/24
Get-NetIPsecMainModeSA
Get-NetIPsecQuickModeSA
```

## Journaux et tests

```powershell
Get-Content "$env:SystemRoot\System32\LogFiles\Firewall\pfirewall.log" -Tail 30
Get-WinEvent -LogName "Microsoft-Windows-Windows Firewall With Advanced Security/Firewall" -MaxEvents 20
Test-NetConnection srv-web01 -Port 3389
auditpol /set /subcategory:"Filtering Platform Packet Drop" /failure:enable      # événements 5152 (volumineux)
```

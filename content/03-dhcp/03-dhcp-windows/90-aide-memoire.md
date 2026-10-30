---
title: DHCP Windows Server — aide-mémoire des commandes
description: Commandes du serveur DHCP Windows avec exemples — installation et autorisation dans l'AD, étendues IPv4/IPv6, plages d'exclusion, options (serveur, étendue, réservation, options personnalisées 66/150/43), réservations, baux, filtres MAC, classes de fournisseur et stratégies, basculement (failover), audit et journaux, sauvegarde, export/import et migration, netsh dhcp.
tags: [aide-mémoire, dhcp windows, powershell, failover, netsh, réservations]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|DHCP Windows Server]]. Module PowerShell **DhcpServer**.

## Installation et autorisation

```powershell
Install-WindowsFeature DHCP -IncludeManagementTools
Add-DhcpServerSecurityGroup ; Restart-Service DHCPServer
Add-DhcpServerInDC -DnsName dhcp01.corp.exemple.fr -IPAddress 10.0.10.67
Get-DhcpServerInDC
# Supprimer l'avertissement post-installation du Gestionnaire de serveur
Set-ItemProperty -Path HKLM:\SOFTWARE\Microsoft\ServerManager\Roles\12 -Name ConfigurationState -Value 2
```

## Étendues et options

```powershell
Add-DhcpServerv4Scope -Name "Utilisateurs Paris" -StartRange 10.0.20.1 -EndRange 10.0.20.254 -SubnetMask 255.255.255.0 -LeaseDuration 8.00:00:00 -State Active
Add-DhcpServerv4ExclusionRange -ScopeId 10.0.20.0 -StartRange 10.0.20.1 -EndRange 10.0.20.49
Set-DhcpServerv4OptionValue -DnsServer 10.0.10.11, 10.0.10.12 -DnsDomain corp.exemple.fr       # options serveur
Set-DhcpServerv4OptionValue -ScopeId 10.0.20.0 -Router 10.0.20.1
Set-DhcpServerv4OptionValue -ScopeId 10.0.40.0 -OptionId 66 -Value "https://prov.exemple.fr/"
# Option personnalisée 150 (Cisco) à définir avant usage
Add-DhcpServerv4OptionDefinition -OptionId 150 -Name "Cisco TFTP" -Type IPv4Address -MultiValued
Set-DhcpServerv4OptionValue -ScopeId 10.0.40.0 -OptionId 150 -Value 10.0.40.5
Get-DhcpServerv4Scope | Format-Table ScopeId, Name, State, StartRange, EndRange
Get-DhcpServerv4OptionValue -ScopeId 10.0.20.0 -All
Get-DhcpServerv4ScopeStatistics | Format-Table ScopeId, Free, InUse, PercentageInUse
Set-DhcpServerv4Scope -ScopeId 10.0.20.0 -State InActive
Remove-DhcpServerv4Scope -ScopeId 10.0.99.0 -Force
# IPv6
Add-DhcpServerv6Scope -Prefix 2001:db8:20:: -Name "Paris v6"
```

## Réservations et baux

```powershell
Add-DhcpServerv4Reservation -ScopeId 10.0.20.0 -IPAddress 10.0.20.10 -ClientId "00-11-22-33-44-55" -Name "imprimante-rdc" -Description "RDC"
Get-DhcpServerv4Reservation -ScopeId 10.0.20.0
Set-DhcpServerv4OptionValue -ReservedIP 10.0.20.10 -Router 10.0.20.254
Get-DhcpServerv4Lease -ScopeId 10.0.20.0 | Sort-Object IPAddress | Format-Table IPAddress, ClientId, HostName, LeaseExpiryTime
Get-DhcpServerv4Lease -ScopeId 10.0.20.0 -ClientId "00-11-22-33-44-55"
# Convertir un bail en réservation
Get-DhcpServerv4Lease -ScopeId 10.0.20.0 -IPAddress 10.0.20.57 | Add-DhcpServerv4Reservation
Remove-DhcpServerv4Lease -ScopeId 10.0.20.0 -IPAddress 10.0.20.57
```

## Filtres, classes et stratégies

```powershell
Set-DhcpServerv4FilterList -Allow $true -Deny $true
Add-DhcpServerv4Filter -List Deny -MacAddress "AA-BB-CC-DD-EE-FF" -Description "Poste bloqué"
Add-DhcpServerv4Class -Name "Postes Yealink" -Type Vendor -Data "yealink"
Add-DhcpServerv4Policy -Name "Telephones" -ScopeId 10.0.40.0 -Condition OR -MacAddress EQ,805EC0*
Set-DhcpServerv4OptionValue -ScopeId 10.0.40.0 -PolicyName "Telephones" -OptionId 66 -Value "https://prov.exemple.fr/yealink/"
Get-DhcpServerv4Policy -ScopeId 10.0.40.0
```

## Basculement

```powershell
Add-DhcpServerv4Failover -Name "Paris-HA" -PartnerServer dhcp02.corp.exemple.fr -ScopeId 10.0.20.0, 10.0.40.0 -LoadBalancePercent 50 -SharedSecret "SecretPartage2026" -MaxClientLeadTime 01:00:00 -AutoStateTransition $true
Get-DhcpServerv4Failover
Invoke-DhcpServerv4FailoverReplication -Name "Paris-HA" -Force         # pousser la configuration au partenaire
Add-DhcpServerv4FailoverScope -Name "Paris-HA" -ScopeId 10.0.50.0
Set-DhcpServerv4Failover -Name "Paris-HA" -Mode HotStandby -ServerRole Active -ReservePercent 5
```

## Audit, sauvegarde, migration

```powershell
Get-DhcpServerAuditLog
Get-Content "$env:SystemRoot\System32\dhcp\DhcpSrvLog-$((Get-Date).DayOfWeek.ToString().Substring(0,3)).log" -Tail 20   # nom selon la langue du système
Backup-DhcpServer -Path D:\Sauvegardes\DHCP
Restore-DhcpServer -Path D:\Sauvegardes\DHCP
Export-DhcpServer -File C:\Temp\dhcp.xml -Leases -Force
Import-DhcpServer -File C:\Temp\dhcp.xml -BackupPath C:\Temp\dhcpbak -Leases -ServerConfigOnly:$false
Get-DhcpServerv4DnsSetting
Set-DhcpServerv4DnsSetting -DynamicUpdates Always -DeleteDnsRROnLeaseExpiry $true
```

## netsh (héritage, scripts existants)

```powershell
netsh dhcp server \\dhcp01 show scope
netsh dhcp server \\dhcp01 scope 10.0.20.0 show clients 1
netsh dhcp server \\dhcp01 dump > C:\Temp\dhcp-dump.txt
```

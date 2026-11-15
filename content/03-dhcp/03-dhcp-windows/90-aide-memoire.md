---
title: DHCP Windows Server — aide-mémoire des commandes
description: Référence complète des commandes du serveur DHCP Windows (module DhcpServer) avec exemples — installation et autorisation dans AD, paramètres (détection de conflits), étendues, super-étendues, exclusions, options (serveur, étendue, réservation, personnalisées), adresses libres, réservations et baux, filtres, classes et stratégies (avec plages), mises à jour DNS et identifiants dédiés, basculement (états, partenaire hors service, réplication), base et journal d'audit, journaux d'événements, inventaire multi-serveurs et alerte d'occupation, sauvegarde, migration, netsh et commandes côté client.
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

## Paramètres, super-étendues, adresses libres

```powershell
Get-DhcpServerSetting
Set-DhcpServerSetting -ConflictDetectionAttempts 2                       # ping avant attribution
Add-DhcpServerv4Superscope -SuperscopeName "Paris-VLAN20" -ScopeId 10.0.20.0, 10.0.21.0
Get-DhcpServerv4Superscope
Get-DhcpServerv4FreeIPAddress -ScopeId 10.0.20.0 -NumAddress 5
Set-DhcpServerv4Scope -ScopeId 10.0.20.0 -LeaseDuration 1.00:00:00
Set-DhcpServerv6OptionValue -DnsServer 2001:db8::53 -DomainSearchList corp.exemple.fr
```

## Stratégies avec plage dédiée

```powershell
Add-DhcpServerv4PolicyIPRange -Name "Telephones" -ScopeId 10.0.40.0 -StartRange 10.0.40.50 -EndRange 10.0.40.99
Get-DhcpServerv4PolicyIPRange -ScopeId 10.0.40.0 -Name "Telephones"
Set-DhcpServerv4Policy -Name "Telephones" -ScopeId 10.0.40.0 -Enabled $false
```

## Mises à jour DNS

```powershell
Set-DhcpServerv4DnsSetting -ScopeId 10.0.20.0 -DynamicUpdates OnClientRequest -NameProtection $true -DeleteDnsRROnLeaseExpiry $true
Set-DhcpServerDnsCredential -Credential (Get-Credential CORP\svc-dhcp-dns)     # compte dédié (pas un compte ordinateur de DC)
Get-DhcpServerDnsCredential
```

## Basculement : états

```powershell
Get-DhcpServerv4Failover | Select-Object Name, PartnerServer, Mode, State, LoadBalancePercent, ScopeId
Set-DhcpServerv4Failover -Name "Paris-HA" -PartnerDown                  # partenaire définitivement perdu
Remove-DhcpServerv4FailoverScope -Name "Paris-HA" -ScopeId 10.0.50.0
Remove-DhcpServerv4Failover -Name "Paris-HA"
```

## Base, audit, journaux

```powershell
Get-DhcpServerDatabase
Set-DhcpServerDatabase -BackupInterval 30 -CleanupInterval 60
Set-DhcpServerAuditLog -Enable $true -Path "$env:SystemRoot\System32\dhcp"
Get-WinEvent -LogName "Microsoft-Windows-Dhcp-Server/Operational" -MaxEvents 30 | Select-Object TimeCreated, Id, Message
Get-WinEvent -LogName "Microsoft-Windows-Dhcp-Server/AdminEvents" -MaxEvents 30 | Select-Object TimeCreated, Id, Message
Get-WinEvent -LogName "Microsoft-Windows-Dhcp-Server/FilterNotifications" -MaxEvents 30 | Select-Object TimeCreated, Message
```

## Inventaire et alerte d'occupation

```powershell
# Toutes les étendues de tous les serveurs autorisés, occupation décroissante
Get-DhcpServerInDC | ForEach-Object { $s = $_.DnsName; Get-DhcpServerv4ScopeStatistics -ComputerName $s | Select-Object @{n='Serveur';e={$s}}, ScopeId, Free, InUse, PercentageInUse } | Sort-Object PercentageInUse -Descending | Format-Table
# Étendues pleines à plus de 90 %
Get-DhcpServerv4ScopeStatistics | Where-Object PercentageInUse -gt 90 | Select-Object ScopeId, PercentageInUse
Get-DhcpServerv4Statistics | Select-Object TotalScopes, TotalAddresses, AddressesInUse, PercentageInUse
```

## Migration depuis un ancien serveur

```powershell
Export-DhcpServer -ComputerName ancien-dhcp.corp.exemple.fr -File C:\Temp\migration-dhcp.xml -Leases -Force
Import-DhcpServer -ComputerName dhcp01.corp.exemple.fr -File C:\Temp\migration-dhcp.xml -BackupPath C:\Temp\dhcp-avant-import -Leases
Remove-DhcpServerInDC -DnsName ancien-dhcp.corp.exemple.fr -IPAddress 10.0.10.66
```

## Côté client

```powershell
ipconfig /release ; ipconfig /renew
ipconfig /all | Select-String "DHCP|Bail|Lease"
Get-NetIPInterface -AddressFamily IPv4 | Select-Object InterfaceAlias, Dhcp, ConnectionState
Get-NetIPConfiguration -Detailed
```

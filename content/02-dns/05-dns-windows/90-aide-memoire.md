---
title: DNS Windows Server — aide-mémoire des commandes
description: Référence complète des commandes du serveur DNS Windows avec exemples — module DnsServer : installation, paramètres et statistiques, zones (intégrées AD, fichiers, secondaires, stub, inverses, conversion), délégation, transferts et notifications, enregistrements (A, AAAA, CNAME, MX, TXT, SRV, PTR, modification, suppression), redirecteurs et redirecteurs conditionnels, cache et vieillissement, liste de blocage globale, étendues de récursivité, limitation du débit des réponses, stratégies DNS, DNSSEC, journaux d'audit et analytiques, export et sauvegarde des zones, client DNS (serveurs, cache, NRPT, DNS over HTTPS) et diagnostic (Resolve-DnsName, nslookup, dnscmd, dcdiag).
tags: [aide-mémoire, dns windows, powershell, dnscmd, resolve-dnsname, active directory]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-zones-strategies|DNS Windows Server]]. Module PowerShell **DnsServer**.

## Installation et serveur

```powershell
Install-WindowsFeature DNS -IncludeManagementTools
Get-DnsServer -ComputerName DC01 | Select-Object -ExpandProperty ServerSetting
Restart-Service DNS
Get-DnsServerStatistics | Select-Object -ExpandProperty QueryStatistics
Test-DnsServer -IPAddress 10.0.10.11 -ZoneName corp.exemple.fr
```

## Zones

```powershell
Add-DnsServerPrimaryZone -Name "exemple.fr" -ReplicationScope Forest -DynamicUpdate Secure
Add-DnsServerPrimaryZone -NetworkId "10.0.30.0/24" -ReplicationScope Domain
Add-DnsServerPrimaryZone -Name "dmz.exemple.fr" -ZoneFile "dmz.exemple.fr.dns"      # fichier, hors AD
Add-DnsServerSecondaryZone -Name "partenaire.fr" -ZoneFile "partenaire.fr.dns" -MasterServers 198.51.100.53
Add-DnsServerStubZone -Name "filiale.fr" -MasterServers 10.50.0.10 -ReplicationScope Forest
Get-DnsServerZone
Set-DnsServerPrimaryZone -Name "exemple.fr" -SecureSecondaries TransferToSecureServers -SecondaryServers 10.0.10.12
Start-DnsServerZoneTransfer -Name "partenaire.fr" -FullTransfer
Remove-DnsServerZone -Name "ancienne.fr" -Force
ConvertTo-DnsServerPrimaryZone -Name "dmz.exemple.fr" -ReplicationScope Domain -Force    # passer en intégrée AD
```

## Enregistrements

```powershell
Add-DnsServerResourceRecordA -ZoneName exemple.fr -Name www -IPv4Address 10.0.30.10 -CreatePtr -TimeToLive 01:00:00
Add-DnsServerResourceRecordAAAA -ZoneName exemple.fr -Name www -IPv6Address 2001:db8::10
Add-DnsServerResourceRecordCName -ZoneName exemple.fr -Name intranet -HostNameAlias www.exemple.fr
Add-DnsServerResourceRecordMX -ZoneName exemple.fr -Name "." -MailExchange mail.exemple.fr -Preference 10
Add-DnsServerResourceRecord -ZoneName exemple.fr -Name "@" -Txt -DescriptiveText "v=spf1 mx -all"
Add-DnsServerResourceRecord -ZoneName exemple.fr -Name "_sip._tls" -Srv -DomainName pbx.exemple.fr -Priority 10 -Weight 10 -Port 5061
Add-DnsServerResourceRecordPtr -ZoneName "30.0.10.in-addr.arpa" -Name 20 -PtrDomainName app.exemple.fr
Get-DnsServerResourceRecord -ZoneName exemple.fr -Name www
Get-DnsServerResourceRecord -ZoneName exemple.fr -RRType A | Where-Object { $_.RecordData.IPv4Address -like "10.0.30.*" }
# Modifier l'adresse d'un enregistrement A
$ancien = Get-DnsServerResourceRecord -ZoneName exemple.fr -Name www -RRType A
$nouveau = $ancien.Clone(); $nouveau.RecordData.IPv4Address = [ipaddress]"10.0.30.11"
Set-DnsServerResourceRecord -ZoneName exemple.fr -OldInputObject $ancien -NewInputObject $nouveau
Remove-DnsServerResourceRecord -ZoneName exemple.fr -Name www -RRType A -Force
```

## Redirecteurs, cache, vieillissement

```powershell
Set-DnsServerForwarder -IPAddress 1.1.1.1, 9.9.9.9 -UseRootHint $false
Add-DnsServerConditionalForwarderZone -Name "partenaire.fr" -MasterServers 198.51.100.53 -ReplicationScope Forest
Get-DnsServerCache | Select-Object MaxTTL, EnablePollutionProtection
Clear-DnsServerCache -Force
Show-DnsServerCache | Select-Object -First 20
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00 -RefreshInterval 7.00:00:00 -NoRefreshInterval 7.00:00:00 -ApplyOnAllZones
Start-DnsServerScavenging -Force
Set-DnsServerRecursion -Enable $true -AdditionalTimeout 4
```

## Stratégies DNS (exemples)

```powershell
Add-DnsServerClientSubnet -Name "Lyon" -IPv4Subnet 10.20.0.0/16
Add-DnsServerZoneScope -ZoneName exemple.fr -Name "ScopeLyon"
Add-DnsServerResourceRecord -ZoneName exemple.fr -A -Name intranet -IPv4Address 10.20.30.10 -ZoneScope "ScopeLyon"
Add-DnsServerQueryResolutionPolicy -Name "IntranetLyon" -Action ALLOW -ClientSubnet "eq,Lyon" -ZoneScope "ScopeLyon,1" -ZoneName exemple.fr
# Bloquer un domaine
Add-DnsServerQueryResolutionPolicy -Name "Blocage-pub" -Action IGNORE -FQDN "EQ,*.pub.exemple.net"
Get-DnsServerQueryResolutionPolicy
```

## DNSSEC

```powershell
Invoke-DnsServerZoneSign -ZoneName exemple.fr -SignWithDefault -Force
Get-DnsServerDnsSecZoneSetting -ZoneName exemple.fr
Get-DnsServerSigningKey -ZoneName exemple.fr
Export-DnsServerDnsSecPublicKey -ZoneName exemple.fr -Path C:\Temp
Invoke-DnsServerZoneUnsign -ZoneName exemple.fr -Force
```

## Diagnostic et journaux

```powershell
Resolve-DnsName www.exemple.fr -Server 10.0.10.11
Resolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.corp.exemple.fr
Resolve-DnsName www.exemple.com -DnssecOk
nslookup -type=MX exemple.fr 10.0.10.11
ipconfig /displaydns
ipconfig /flushdns
ipconfig /registerdns
Clear-DnsClientCache
dcdiag /test:dns /v
Set-DnsServerDiagnostics -All $true            # journal de débogage (temporaire, volumineux)
Set-DnsServerDiagnostics -All $false
Get-WinEvent -LogName "Microsoft-Windows-DNSServer/Analytical" -Oldest -MaxEvents 50 -ErrorAction SilentlyContinue
dnscmd /enumzones
dnscmd /zoneinfo exemple.fr
dnscmd /zoneexport exemple.fr sauvegarde\exemple.fr.dns     # fichier dans %SystemRoot%\System32\dns\sauvegarde
```

## Zones : délégation, notification, export

```powershell
Add-DnsServerZoneDelegation -Name "exemple.fr" -ChildZoneName "agences" -NameServer "ns-agences.exemple.fr" -IPAddress 10.20.0.53
Set-DnsServerPrimaryZone -Name "exemple.fr" -Notify NotifyServers -NotifyServers 10.0.10.12
Get-DnsServerZoneTransferPolicy -ZoneName "exemple.fr" -ErrorAction SilentlyContinue
Export-DnsServerZone -Name "exemple.fr" -FileName "exemple.fr.sauvegarde.dns"          # dans %SystemRoot%\System32\dns
# Exporter toutes les zones primaires
Get-DnsServerZone | Where-Object { -not $_.IsAutoCreated -and $_.ZoneType -eq "Primary" } | ForEach-Object { Export-DnsServerZone -Name $_.ZoneName -FileName "$($_.ZoneName)-$(Get-Date -Format yyyyMMdd).dns" }
Get-DnsServerStatistics -ZoneName "exemple.fr"
```

## Sécurité et performances du serveur

```powershell
Get-DnsServerSetting -All | Select-Object ListeningIPAddress, EnableDnsSec, SocketPoolSize, EnableIPv6
dnscmd /resetlisteningaddresses 10.0.10.11                         # écouter sur une seule adresse
dnscmd /config /socketpoolsize 10000                               # ports sources aléatoires
Set-DnsServerCache -LockingPercent 100                             # entrées du cache non écrasables avant expiration
Get-DnsServerGlobalQueryBlockList
Set-DnsServerGlobalQueryBlockList -List wpad, isatap -Enable $true
Get-DnsServerRootHint | Select-Object -First 3
Get-DnsServerEDns

# Récursivité seulement pour les clients internes (étendues de récursivité + stratégie)
Set-DnsServerRecursionScope -Name . -EnableRecursion $false
Add-DnsServerRecursionScope -Name "Interne" -EnableRecursion $true
Add-DnsServerClientSubnet -Name "Reseaux-internes" -IPv4Subnet 10.0.0.0/8
Add-DnsServerQueryResolutionPolicy -Name "Recursion-interne" -Action ALLOW -ApplyOnRecursion -RecursionScope "Interne" -ClientSubnet "eq,Reseaux-internes"

# Limitation du débit des réponses (RRL)
Set-DnsServerResponseRateLimiting -Mode Enable -ResponsesPerSec 10 -ErrorsPerSec 5 -WindowInSec 5
Get-DnsServerResponseRateLimiting
Add-DnsServerResponseRateLimitingExceptionlist -Name "Reseaux-internes" -ClientSubnet "eq,Reseaux-internes"
```

## Journaux d'audit et analytiques

```powershell
# Audit : ajouts (515), suppressions (516) d'enregistrements, modifications de zones
Get-WinEvent -LogName "Microsoft-Windows-DNSServer/Audit" -MaxEvents 30 | Select-Object TimeCreated, Id, Message
# Journal analytique (chaque requête) : activer temporairement
wevtutil sl "Microsoft-Windows-DNSServer/Analytical" /e:true /q:true
Get-WinEvent -LogName "Microsoft-Windows-DNSServer/Analytical" -Oldest -MaxEvents 50 | Select-Object TimeCreated, Message
wevtutil sl "Microsoft-Windows-DNSServer/Analytical" /e:false
Get-WinEvent -LogName "DNS Server" -MaxEvents 30 | Where-Object LevelDisplayName -in "Erreur", "Error", "Avertissement", "Warning"
```

## Client DNS Windows

```powershell
Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object ServerAddresses
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 10.0.10.11, 10.0.10.12
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ResetServerAddresses           # revenir au DHCP
Get-DnsClientCache | Where-Object Entry -like "*exemple.fr*"
Get-DnsClientGlobalSetting                                                           # suffixes de recherche
Set-DnsClientGlobalSetting -SuffixSearchList @("corp.exemple.fr", "exemple.fr")
# Table de stratégie de résolution de noms (NRPT) : espace de noms → serveurs dédiés
Add-DnsClientNrptRule -Namespace ".corp.exemple.fr" -NameServers 10.0.10.11, 10.0.10.12
Get-DnsClientNrptPolicy
# DNS over HTTPS (Windows 11, Windows Server 2022)
Add-DnsClientDohServerAddress -ServerAddress 9.9.9.9 -DohTemplate "https://dns.quad9.net/dns-query" -AllowFallbackToUdp $false -AutoUpgrade $true
Get-DnsClientDohServerAddress
```

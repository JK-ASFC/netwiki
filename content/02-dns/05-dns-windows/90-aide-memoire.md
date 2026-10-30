---
title: DNS Windows Server — aide-mémoire des commandes
description: Commandes du serveur DNS Windows avec exemples — installation, zones (principales intégrées AD, secondaires, stub, inverses), enregistrements (A, AAAA, CNAME, MX, PTR, SRV, TXT), redirecteurs et redirecteurs conditionnels, cache, vieillissement et nettoyage, stratégies DNS, DNSSEC, journalisation et diagnostic (dnscmd, Resolve-DnsName, nslookup, ipconfig), sauvegarde des zones.
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

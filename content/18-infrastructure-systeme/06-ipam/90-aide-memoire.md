---
title: IPAM (Windows Server, NetBox, phpIPAM) — aide-mémoire des commandes
description: Commandes IPAM avec exemples — IPAM Windows Server (installation, provisionnement par GPO Invoke-IpamGpoProvisioning, découverte des serveurs, blocs et plages, adresses, recherche, journal des adresses), NetBox (API REST : préfixes, adresses disponibles, attribution, équipements ; pynetbox), phpIPAM (API) et outils de recherche d'adresses libres.
tags: [aide-mémoire, ipam, netbox, phpipam, windows server, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-deploiement|IPAM]].

## IPAM Windows Server

```powershell
Install-WindowsFeature IPAM -IncludeManagementTools
Invoke-IpamServerProvisioning -WorkingDirectory C:\IPAM -ProvisioningMethod Automatic -GpoPrefix IPAM
Invoke-IpamGpoProvisioning -Domain corp.exemple.fr -GpoPrefixName IPAM -IpamServerFqdn ipam01.corp.exemple.fr -DelegatedGpoUser "CORP\GG-Admins-IPAM"
Add-IpamDiscoveryDomain -Name corp.exemple.fr -DiscoverDc $true -DiscoverDns $true -DiscoverDhcp $true
Get-IpamServerInventory | Format-Table Name, ServerType, ManageabilityStatus
Set-IpamServerInventory -Name dhcp01.corp.exemple.fr -ManageabilityStatus Managed
Add-IpamBlock -NetworkId 10.0.0.0/8
Add-IpamRange -NetworkId 10.0.30.0/24 -StartIPAddress 10.0.30.10 -EndIPAddress 10.0.30.250 -ManagedByService "IPAM" -ServiceInstance "Localhost"
Get-IpamRange -AddressFamily IPv4 | Format-Table NetworkId, StartIPAddress, EndIPAddress, PercentageUtilized
Get-IpamRange -StartIPAddress 10.0.30.10 -EndIPAddress 10.0.30.250 | Find-IpamFreeAddress -NumAddress 3
Add-IpamAddress -IpAddress 10.0.30.25 -DeviceName "srv-app05" -Description "Serveur applicatif"
Get-IpamAddress -AddressFamily IPv4 | Where-Object DeviceName -like "srv-app*"
Get-IpamIpAddressAuditEvent -StartDate (Get-Date).AddDays(-1) -EndDate (Get-Date) -IpAddress 10.0.30.25
```

## NetBox (API REST)

```bash
N=https://netbox.exemple.fr/api; H=(-s -H "Authorization: Token $NETBOX_TOKEN" -H "Accept: application/json")
curl "${H[@]}" "$N/ipam/prefixes/?q=10.0.30.0/24" | jq '.results[] | {id, prefix, vlan: .vlan.name}'
curl "${H[@]}" "$N/ipam/prefixes/12/available-ips/?limit=3" | jq '.[].address'
# Réserver la prochaine adresse libre du préfixe 12
curl "${H[@]}" -X POST -H "Content-Type: application/json" "$N/ipam/prefixes/12/available-ips/" -d '{"dns_name":"srv-app05.exemple.fr","description":"Serveur applicatif","status":"active"}'
curl "${H[@]}" "$N/ipam/ip-addresses/?address=10.0.30.25" | jq '.results[0] | {id, address, dns_name}'
curl "${H[@]}" "$N/dcim/devices/?site=paris&role=commutateur" | jq '.results[].name'
curl "${H[@]}" "$N/ipam/vlans/?site=paris" | jq '.results[] | {vid, name}'
```

```python
import pynetbox
nb = pynetbox.api("https://netbox.exemple.fr", token="JETON")
prefixe = nb.ipam.prefixes.get(prefix="10.0.30.0/24")
ip = prefixe.available_ips.create({"dns_name": "srv-app06.exemple.fr", "status": "active"})
print(ip.address)
```

## phpIPAM (API)

```bash
P=https://ipam.exemple.fr/api/netwiki
TOKEN=$(curl -s -X POST -u api-user:"$MDP" "$P/user/" | jq -r .data.token)
curl -s -H "token: $TOKEN" "$P/subnets/search/10.0.30.0/24/" | jq '.data[0].id'
curl -s -H "token: $TOKEN" "$P/subnets/7/first_free/" | jq .data
curl -s -X POST -H "token: $TOKEN" "$P/addresses/first_free/7/" -d "hostname=srv-app07&description=Serveur applicatif" | jq .data
```

## Vérifier qu'une adresse est vraiment libre

```bash
ping -c 2 10.0.30.25; arping -c 2 -I eth0 10.0.30.25; dig -x 10.0.30.25 +short
```

---
title: Installation, zones, transferts et stratégies DNS
description: Rôle Serveur DNS de Windows Server au-delà d'Active Directory — installation sur un serveur membre ou autonome, zones principales fichier, secondaires et de stub, transferts et notifications, redirecteurs, indications de racine, stratégies DNS (split-brain, géolocalisation, filtrage, plages horaires), limitation du débit des réponses et commandes PowerShell DnsServer.
tags: [windows server, dns, zones, transferts, stratégies dns, split-brain, rrl, powershell]
icon: globe
---

Le rôle **Serveur DNS** de Windows Server est le plus souvent installé sur les contrôleurs de domaine, avec des **zones intégrées à AD** : ce cas est traité dans [[01-active-directory/03-dns-integre|DNS intégré à Active Directory]]. Cette page couvre le reste : serveur DNS **membre ou autonome**, zones « fichier », transferts vers d'autres serveurs (BIND, appliances), **stratégies DNS** et protections.

## Installation

```powershell
Install-WindowsFeature DNS -IncludeManagementTools
Get-DnsServer | Select-Object -ExpandProperty ServerSetting | Select-Object ListeningIPAddress, EnableDnsSec
# Écouter seulement sur l'adresse de service
Set-DnsServerSetting -ListeningIPAddress 10.0.10.53 -PassThru | Out-Null
Restart-Service DNS
```

Console : `dnsmgmt.msc`. Fichiers des zones non intégrées : `C:\Windows\System32\dns\`.

## Types de zones

| Type | Stockage | Usage |
| --- | --- | --- |
| Principale intégrée à AD | Annuaire | Zones du domaine (multi-maître) |
| **Principale (fichier)** | `zone.dns` | Serveur hors domaine, zone de DMZ, zone publique |
| **Secondaire** | Copie lecture seule par transfert (AXFR/IXFR) | Redondance, serveurs d'un autre éditeur ou d'un partenaire |
| **Stub** | Seulement SOA, NS et adresses des serveurs faisant autorité | Suivre dynamiquement les serveurs d'une zone partenaire |
| Redirecteur conditionnel | — | Envoyer les requêtes d'un domaine vers des serveurs précis |

```powershell
# Zone principale fichier et enregistrements
Add-DnsServerPrimaryZone -Name "dmz.exemple.fr" -ZoneFile "dmz.exemple.fr.dns" -DynamicUpdate None
Add-DnsServerResourceRecordA -ZoneName "dmz.exemple.fr" -Name "www" -IPv4Address 192.0.2.10 -TimeToLive 01:00:00
Add-DnsServerResourceRecordCName -ZoneName "dmz.exemple.fr" -Name "portail" -HostNameAlias "www.dmz.exemple.fr"
Add-DnsServerResourceRecordMX -ZoneName "dmz.exemple.fr" -Name "." -MailExchange "mx1.dmz.exemple.fr" -Preference 10

# Zone secondaire depuis un BIND
Add-DnsServerSecondaryZone -Name "lab.exemple.fr" -ZoneFile "lab.exemple.fr.dns" -MasterServers 10.0.20.53

# Zone de stub et redirecteur conditionnel
Add-DnsServerStubZone -Name "partenaire.fr" -MasterServers 198.51.100.53 -ReplicationScope Forest
Add-DnsServerConditionalForwarderZone -Name "filiale.local" -MasterServers 10.50.0.10,10.50.0.11 -ReplicationScope Forest
```

## Transferts de zone

```powershell
# Autoriser seulement les serveurs secondaires déclarés, et les notifier des changements
Set-DnsServerPrimaryZone -Name "dmz.exemple.fr" -SecureSecondaries TransferToSecureServers -SecondaryServers 10.0.20.53 -Notify NotifyServers -NotifyServers 10.0.20.53
Start-DnsServerZoneTransfer -Name "lab.exemple.fr" -FullTransfer     # forcer côté secondaire
```

Ne laissez **jamais** « Vers n'importe quel serveur » : un transfert de zone libre révèle tout le plan de nommage. Pour un secondaire BIND d'une zone Windows, voir [[01-bind9/05-primaire-secondaire-transferts|transferts avec BIND]].

## Redirecteurs et récursivité

```powershell
Set-DnsServerForwarder -IPAddress 10.0.10.153,10.0.10.154 -UseRootHint $false -Timeout 3
Get-DnsServerRootHint
# Serveur purement autoritaire (DMZ exposée) : désactiver la récursivité
Set-DnsServerRecursion -Enable $false
```

Un serveur **exposé sur Internet** doit être uniquement autoritaire (récursivité désactivée), sinon il devient un résolveur ouvert utilisable pour des attaques par amplification.

## Stratégies DNS

Les **stratégies DNS** (Windows Server 2016+) adaptent la réponse selon le client, l'interface, l'heure ou le type de requête.

```powershell
# Split-brain : réponse interne différente pour www.exemple.fr
Add-DnsServerClientSubnet -Name "Interne" -IPv4Subnet 10.0.0.0/8
Add-DnsServerZoneScope -ZoneName "exemple.fr" -Name "ScopeInterne"
Add-DnsServerResourceRecord -ZoneName "exemple.fr" -A -Name "www" -IPv4Address 10.0.30.10 -ZoneScope "ScopeInterne"
Add-DnsServerQueryResolutionPolicy -Name "SplitBrainInterne" -Action ALLOW -ClientSubnet "eq,Interne" -ZoneScope "ScopeInterne,1" -ZoneName "exemple.fr"

# Bloquer un domaine malveillant pour tous les clients
Add-DnsServerQueryResolutionPolicy -Name "BlocageMalveillant" -Action IGNORE -FQDN "EQ,*.domaine-malveillant.example"

# Pas de récursivité pour les clients externes (serveur mixte)
Add-DnsServerRecursionScope -Name "SansRecursion" -EnableRecursion $false
Add-DnsServerQueryResolutionPolicy -Name "ExterneSansRecursion" -Action ALLOW -ApplyOnRecursion -RecursionScope "SansRecursion" -ServerInterfaceIP "EQ,192.0.2.53"

Get-DnsServerQueryResolutionPolicy -ZoneName "exemple.fr"
```

| Critère | Exemples |
| --- | --- |
| `ClientSubnet` | Réseau du client (interne, filiale, pays) |
| `ServerInterfaceIP` | Interface sur laquelle la requête arrive |
| `TimeOfDay` | Répartition selon l'heure |
| `FQDN`, `QType`, `TransportProtocol` | Nom demandé, type d'enregistrement, UDP/TCP |

## Limitation du débit des réponses (RRL)

```powershell
Set-DnsServerResponseRateLimiting -Mode Enable -ResponsesPerSec 10 -ErrorsPerSec 5 -WindowInSec 5 -LeakRate 3 -TruncateRate 2
Get-DnsServerResponseRateLimiting
```

À activer sur les serveurs **autoritaires exposés** (atténue l'amplification et les attaques par réflexion).

Suite : [[02-dnssec-securite-depannage|DNSSEC, sécurité, journaux et dépannage]].

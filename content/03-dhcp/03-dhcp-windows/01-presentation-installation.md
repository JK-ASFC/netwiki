---
title: Présentation, installation et étendues
description: Rôle Serveur DHCP de Windows Server — autorisation dans Active Directory, groupes de sécurité, étendues IPv4 (plages, exclusions, durée des baux), options serveur, étendue et réservation (routeur, DNS, domaine, NTP, PXE, téléphonie), réservations, superétendues, étendues multidiffusion et DHCPv6, relais DHCP, administration PowerShell.
tags: [windows server, dhcp, étendues, options, réservations, autorisation ad, powershell]
icon: info
---

Le rôle **Serveur DHCP** de Windows Server est le choix naturel dans un environnement Active Directory : administration graphique et PowerShell, **basculement** intégré, mise à jour **DNS dynamique** sécurisée et intégration à **IPAM**. Pour un serveur DHCP sous Linux, voir [[02-kea/01-presentation-installation|Kea]].

## Installation et autorisation

```powershell
Install-WindowsFeature DHCP -IncludeManagementTools
# Groupes locaux « Administrateurs DHCP » et « Utilisateurs DHCP »
netsh dhcp add securitygroups
Restart-Service DHCPServer

# Autorisation dans AD (obligatoire pour qu'un serveur membre du domaine distribue des baux)
Add-DhcpServerInDC -DnsName srv-dhcp-01.corp.exemple.fr -IPAddress 10.0.10.67
Get-DhcpServerInDC

# Supprimer l'avertissement de configuration post-installation dans le Gestionnaire de serveur
Set-ItemProperty -Path HKLM:\SOFTWARE\Microsoft\ServerManager\Roles\12 -Name ConfigurationState -Value 2
```

L'**autorisation AD** empêche un serveur DHCP Windows non approuvé, membre du domaine, de démarrer le service de distribution. Elle ne protège pas contre un serveur pirate quelconque : activez le **DHCP snooping** sur les commutateurs.

## Étendues

```powershell
Add-DhcpServerv4Scope -Name "VLAN20-Serveurs" -StartRange 10.0.20.50 -EndRange 10.0.20.250 -SubnetMask 255.255.255.0 -LeaseDuration 8.00:00:00 -State Active
Add-DhcpServerv4ExclusionRange -ScopeId 10.0.20.0 -StartRange 10.0.20.50 -EndRange 10.0.20.59

Add-DhcpServerv4Scope -Name "VLAN40-Utilisateurs" -StartRange 10.0.40.20 -EndRange 10.0.40.250 -SubnetMask 255.255.255.0 -LeaseDuration 1.00:00:00
Add-DhcpServerv4Scope -Name "VLAN90-Invites" -StartRange 10.0.90.20 -EndRange 10.0.91.250 -SubnetMask 255.255.254.0 -LeaseDuration 04:00:00

Get-DhcpServerv4Scope | Format-Table ScopeId, Name, StartRange, EndRange, LeaseDuration, State
Get-DhcpServerv4ScopeStatistics | Format-Table ScopeId, Free, InUse, PercentageInUse
```

Durées de bail : 8 jours pour des postes fixes, 1 jour pour les utilisateurs, quelques heures pour les invités et le Wi-Fi public (renouvellement rapide des adresses).

## Options

```powershell
# Options serveur (héritées par toutes les étendues)
Set-DhcpServerv4OptionValue -DnsServer 10.0.10.53,10.0.10.54 -DnsDomain corp.exemple.fr
Set-DhcpServerv4OptionValue -OptionId 42 -Value 10.0.10.123            # NTP

# Options d'étendue
Set-DhcpServerv4OptionValue -ScopeId 10.0.40.0 -Router 10.0.40.1
Set-DhcpServerv4OptionValue -ScopeId 10.0.90.0 -Router 10.0.90.1 -DnsServer 9.9.9.9,149.112.112.112   # invités : DNS public

# Option non standard : TFTP Cisco (150)
Add-DhcpServerv4OptionDefinition -Name "TFTP Cisco" -OptionId 150 -Type IPv4Address -MultiValued
Set-DhcpServerv4OptionValue -ScopeId 10.0.30.0 -OptionId 150 -Value 10.0.30.5
```

| Option | Code | Usage |
| --- | --- | --- |
| Routeur | 3 | Passerelle par défaut (niveau **étendue**) |
| Serveurs DNS | 6 | Résolveurs |
| Nom de domaine | 15 | Suffixe DNS |
| Serveurs NTP | 42 | Temps |
| Fournisseur (*vendor*) | 43 | Contrôleurs Wi-Fi (Aruba, Cisco), téléphones |
| Serveur et fichier de démarrage | 66 / 67 | PXE (préférer des stratégies BIOS/UEFI ou WDS, voir [[04-wds/01-presentation-installation\|WDS]]) |
| Recherche de domaines | 119 | Liste de suffixes (Windows ne l'utilise pas : GPO) |

Ordre de priorité : **réservation** > **stratégie** > **étendue** > **serveur**.

## Réservations

```powershell
Add-DhcpServerv4Reservation -ScopeId 10.0.20.0 -IPAddress 10.0.20.10 -ClientId "00-50-56-aa-bb-01" -Name "imp-rdc-01" -Description "Imprimante RDC"
Get-DhcpServerv4Reservation -ScopeId 10.0.20.0
# Convertir un bail existant en réservation
Get-DhcpServerv4Lease -ScopeId 10.0.20.0 -IPAddress 10.0.20.77 | Add-DhcpServerv4Reservation
```

## Relais et sous-réseaux distants

Les VLAN distants atteignent le serveur par un **relais** (`ip helper-address 10.0.10.67` sur la SVI) : le serveur choisit l'étendue d'après l'adresse de la passerelle relais (*giaddr*). Une **superétendue** regroupe plusieurs étendues servies sur un même lien physique.

```powershell
Add-DhcpServerv4Superscope -SuperscopeName "Siege-VLAN40" -ScopeId 10.0.40.0,10.0.41.0
```

## DHCPv6

```powershell
Add-DhcpServerv6Scope -Prefix 2001:db8:40:: -Name "VLAN40-IPv6" -PreferredLifeTime 4.00:00:00 -ValidLifeTime 8.00:00:00
Set-DhcpServerv6OptionValue -DnsServer 2001:db8:10::53 -DomainSearchList corp.exemple.fr
```

La passerelle IPv6 vient des annonces de routeur (RA, drapeaux M/O) ; le serveur DHCPv6 Windows ne délègue pas de préfixes (pas de *prefix delegation*).

Suite : [[02-basculement-strategies-exploitation|basculement, stratégies et exploitation]].

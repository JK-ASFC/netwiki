---
title: Présentation, installation, configuration et commandes
description: Open DHCP Server — serveur DHCP libre et léger (GPL) pour Windows et Linux, cas d'usage (laboratoire, petit site, poste Windows sans rôle serveur, réseau isolé), installation (service Windows, démon Linux), OpenDHCPServer.ini (étendues, plages, options, réservations par MAC, relais), réplication entre deux serveurs, page d'état HTTP, journaux et comparaison avec Kea et le DHCP Windows.
tags: [open dhcp server, dhcp, windows, linux, léger]
icon: info
---

**Open DHCP Server** (GPL, projet SourceForge) est un serveur DHCPv4 autonome et très léger, configuré par un **fichier INI**, qui fonctionne sous **Windows** (service, sans rôle Windows Server) et **Linux**. Usages : laboratoire, maquette, petit site, réseau isolé, dépannage. Pour la production, préférez [[02-kea/01-presentation-installation|Kea]] ou le [[03-dhcp-windows/01-presentation-installation|DHCP Windows Server]].

## Installation

- **Windows** : installateur depuis `sourceforge.net/projects/dhcpserver` → service *Open DHCP Server* ; configuration `C:\OpenDHCPServer\OpenDHCPServer.ini`.
- **Linux** : archive, puis `./opendhcpd -v` (premier plan, verbeux) ou `-i` pour l'installer comme démon ; configuration `/opt/opendhcp/OpenDHCPServer.ini`.

## Configuration

```ini OpenDHCPServer.ini (extrait)
[LISTEN_ON]
10.0.60.1

[LOGGING]
LogLevel=Normal

[HTTP_INTERFACE]
HTTPServer=10.0.60.1:6789

[RANGE_SET]
DHCPRange=10.0.60.100-10.0.60.199
SubnetMask=255.255.255.0
Router=10.0.60.1
DomainServer=10.0.10.53, 10.0.10.54
DomainName=labo.corp.exemple.fr
AddressTime=28800

[GLOBAL_OPTIONS]
NTPServers=10.0.10.123

[00:11:22:33:44:55]
IP=10.0.60.20
Hostname=imprimante-labo
```

Plusieurs sections `[RANGE_SET]` décrivent plusieurs étendues (la sélection se fait selon l'interface d'écoute ou l'agent relais). Réplication : section `[REPLICATION_SERVERS]` (serveur primaire et secondaire qui partagent les baux).

## Exploitation

- Page d'état : `http://10.0.60.1:6789` (baux actifs, étendues).
- Journaux : fichier `log/` du répertoire d'installation (niveau `Debug` pour diagnostiquer).
- Tests : `dhclient -v eth0` (Linux) ou `ipconfig /release && ipconfig /renew` (Windows) ; capture `tcpdump -n -i eth0 port 67 or port 68`.

| Symptôme | Cause et correction |
| --- | --- |
| Aucun client servi | Interface d'écoute absente de `[LISTEN_ON]`, pare-feu (UDP 67), autre DHCP sur le réseau |
| Mauvaise étendue attribuée | Relais (IP helper) ou étendue non associée à l'interface |

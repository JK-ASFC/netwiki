---
title: Endian Firewall Community
description: Endian Firewall Community (EFW) — distribution UTM libre basée sur Linux : zones (GREEN, RED, ORANGE, BLUE), installation, interface web sur le port 10443, pare-feu (entrant, sortant, inter-zones, NAT), proxy HTTP et filtre de contenu, antivirus, IPS, VPN OpenVPN et IPsec, état du projet et différences avec la version commerciale et avec IPFire, pfSense et OPNsense.
tags: [endian, efw, pare-feu, utm, vpn, proxy]
icon: shield
---

**Endian Firewall Community** (EFW, GPL) est l'édition libre d'un **UTM** italien. Comme [[01-ipfire|IPFire]], il organise le réseau en **zones de couleur** (GREEN interne, RED Internet, ORANGE DMZ, BLUE Wi-Fi) et s'administre par une interface web.

> [!WARNING]
> L'édition Community évolue lentement (versions 3.x espacées) ; les fonctions récentes (gestion centralisée, SD-WAN, mises à jour fréquentes) sont réservées aux éditions commerciales. Pour un nouveau déploiement libre, comparez avec [[01-ipfire|IPFire]] et [[19-pfsense-opnsense/01-pfsense|pfSense/OPNsense]].

## Installation

ISO depuis le site d'Endian (*Community*) → installation (efface le disque) → adresse GREEN par défaut `192.168.0.15` → assistant web : `https://192.168.0.15:10443` (mots de passe `admin` web et `root` console/SSH, type de RED, zones, DNS).

## Fonctions

| Menu | Contenu |
| --- | --- |
| **Firewall** | Redirections de ports et NAT source, trafic sortant (règles par zone), inter-zones, VPN, accès au système |
| **Proxy** | HTTP (transparent ou authentifié, filtre de contenu), POP3/SMTP avec antispam et antivirus, DNS |
| **Services** | DHCP, NTP, IPS (Snort/Suricata selon la version), antivirus ClamAV, surveillance du trafic |
| **VPN** | OpenVPN (serveur et client, accès distant et site à site), IPsec |
| Network | Interfaces, VLAN, routage, *uplinks* multiples avec bascule |
| System | Sauvegarde, mises à jour, accès SSH, utilisateurs |

Captures : [[03-interface-graphique|interfaces graphiques]].

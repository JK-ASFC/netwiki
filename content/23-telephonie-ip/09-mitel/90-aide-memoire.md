---
title: Mitel MiVoice — aide-mémoire
description: Repères d'administration des plateformes Mitel (outils web par plateforme, tâches courantes) et commandes de vérification réseau associées (LLDP-MED, PoE, DHCP options, captures) côté commutateurs et serveurs, avec exemples.
tags: [aide-mémoire, mitel, mivoice, lldp-med, poe, dhcp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-mivoice-administration|administration MiVoice]] et [[27-mitel/01-reseau-telephonie-ip|réseau pour la téléphonie Mitel]].

## Où administrer

| Plateforme | Outil |
| --- | --- |
| MiVoice 5000 | Web Admin ; MiVoice 5000 Manager (multisite) |
| MiVoice Business | System Administration Tool (ESM) ; server-manager (MSL) |
| MiVoice Office 400 | WebAdmin |
| MX-ONE | Provisioning Manager, Service Node Manager |

## Vérifications réseau des postes

```cisco
show lldp neighbors detail
show cdp neighbors detail
show power inline
show interfaces GigabitEthernet1/0/12 switchport
show mls qos interface GigabitEthernet1/0/12
```

```bash
# Serveur DHCP Linux (Kea) : options remises au VLAN voix
sudo grep -A6 '"subnet": "10.0.40.0/24"' /etc/kea/kea-dhcp4.conf
# Capture de l'échange DHCP et SIP d'un poste
sudo tcpdump -ni eth0 '(port 67 or port 68 or port 5060 or port 5061) and ether host 08:00:0f:aa:bb:cc'
```

```powershell
# Serveur DHCP Windows : option 125 / 66 de l'étendue voix
Get-DhcpServerv4OptionValue -ScopeId 10.0.40.0 -All | Where-Object OptionId -in 43, 66, 125
```

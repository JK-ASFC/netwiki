---
title: Mitel (réseau) — aide-mémoire des commandes
description: Commandes de vérification du réseau d'accueil d'une téléphonie Mitel avec exemples — VLAN voix, LLDP-MED, PoE et QoS sur Cisco, Aruba AOS-CX et HPE Comware, contrôle des options DHCP, captures SIP et MiNet ; renvoi vers l'aide-mémoire des plateformes MiVoice.
tags: [aide-mémoire, mitel, vlan voix, lldp-med, poe, minet]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-reseau-telephonie-ip|réseau pour la téléphonie Mitel]] et [[02-plateformes-administration|plateformes et administration]]. Les commandes des autocommutateurs sont dans [[23-telephonie-ip/09-mitel/90-aide-memoire|l'aide-mémoire Mitel de la téléphonie IP]].

## Commutateur Cisco

```cisco
show interfaces GigabitEthernet1/0/12 switchport
show lldp neighbors GigabitEthernet1/0/12 detail
show cdp neighbors GigabitEthernet1/0/12 detail
show power inline GigabitEthernet1/0/12
show mls qos interface GigabitEthernet1/0/12
show mac address-table interface GigabitEthernet1/0/12
```

## Aruba AOS-CX

```aoscx
show vlan 40
show lldp neighbor-info 1/1/12
show power-over-ethernet 1/1/12
show interface 1/1/12
show mac-address-table port 1/1/12
```

## HPE Comware

```comware
display voice-vlan state
display lldp neighbor-information interface GigabitEthernet1/0/12 verbose
display poe interface GigabitEthernet1/0/12
display mac-address interface GigabitEthernet1/0/12
```

## DHCP et captures

```bash
# Linux : options reçues par un client du VLAN voix (interface de test)
sudo dhclient -v eth0.40
sudo nmap --script broadcast-dhcp-discover -e eth0.40

# Capture SIP, MiNet et RTP d'un poste
sudo tcpdump -ni eth0 -w poste-mitel.pcap host 10.0.40.25 and \( port 5060 or port 5061 or portrange 6800-6802 or udp \)
```

```powershell
# Windows Server : options d'une étendue voix
Get-DhcpServerv4OptionValue -ScopeId 10.0.40.0 | Format-Table OptionId, Name, Value
```

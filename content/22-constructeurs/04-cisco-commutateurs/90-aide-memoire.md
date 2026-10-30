---
title: Commutateurs Cisco Catalyst — aide-mémoire des commandes
description: Commandes des commutateurs Cisco Catalyst avec exemples — VLAN et ports (access, trunk, voix), EtherChannel/LACP, Spanning Tree (racine, PortFast, BPDU Guard), sécurité d'accès (port-security, DHCP snooping, DAI, 802.1X/MAB), empilement, PoE, miroir de ports (SPAN), table MAC, erreurs et ports err-disabled.
tags: [aide-mémoire, cisco, catalyst, vlan, stp, etherchannel, 802.1x, poe]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-vlan-trunk-stp|VLAN, trunk, STP]], [[02-securite-acces-8021x|sécurité d'accès]] et [[03-stack-poe-depannage|empilement, PoE, dépannage]].

## VLAN et ports

```cisco
show vlan brief
show interfaces status
show interfaces trunk
show interfaces GigabitEthernet1/0/12 switchport
show mac address-table interface GigabitEthernet1/0/12
show mac address-table address 805e.c0a1.b2c3
show cdp neighbors detail
show lldp neighbors detail
! Port d'accès + voix
interface GigabitEthernet1/0/12
 switchport mode access
 switchport access vlan 20
 switchport voice vlan 40
 spanning-tree portfast
 spanning-tree bpduguard enable
```

## Agrégats et spanning tree

```cisco
show etherchannel summary
show lacp neighbor
show spanning-tree summary
show spanning-tree vlan 20
show spanning-tree root
show spanning-tree interface GigabitEthernet1/0/49 detail
```

## Sécurité d'accès

```cisco
show port-security
show port-security interface GigabitEthernet1/0/12
show ip dhcp snooping binding
show ip arp inspection statistics
show access-session interface GigabitEthernet1/0/12 details
show authentication sessions
show radius statistics
test aaa group RADIUS-NPS amartin MotDePasse new-code
```

## Empilement, PoE, SPAN

```cisco
show switch
show switch stack-ports summary
show power inline
show power inline GigabitEthernet1/0/12 detail
monitor session 1 source interface GigabitEthernet1/0/12 both
monitor session 1 destination interface GigabitEthernet1/0/48
show monitor session 1
```

## Erreurs

```cisco
show interfaces status err-disabled
show errdisable recovery
errdisable recovery cause bpduguard
errdisable recovery interval 300
show interfaces GigabitEthernet1/0/12 counters errors
clear counters GigabitEthernet1/0/12
```

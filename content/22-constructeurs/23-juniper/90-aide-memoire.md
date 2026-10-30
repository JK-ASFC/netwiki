---
title: Juniper Junos — aide-mémoire des commandes
description: Commandes Junos avec exemples — mode opérationnel et configuration (set, delete, show | compare, commit check, commit confirmed, rollback), interfaces, VLAN et ports, LACP, routage, LLDP, EX/QFX, SRX (zones, politiques, NAT, sessions, traceoptions, VPN IPsec, châssis cluster), sauvegarde et mise à jour.
tags: [aide-mémoire, juniper, junos, srx, ex, commit confirmed, rollback]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-junos-cli-commutation|CLI et commutation]] et [[02-srx-securite-depannage|SRX, sécurité et dépannage]].

## Mode opérationnel

```junos
show version
show chassis hardware
show interfaces terse
show interfaces ge-0/0/1 extensive
show ethernet-switching table
show vlans
show lacp interfaces
show lldp neighbors
show route
show route 10.50.0.0/16 detail
show ospf neighbor
show bgp summary
show log messages | last 50
show system alarms
show configuration | display set | match vlan
ping 10.0.20.15 count 5 rapid
traceroute 8.8.8.8
monitor traffic interface ge-0/0/1 matching "host 10.0.20.15"
request system configuration rescue save
request system snapshot
```

## Configuration

```junos
configure
set system host-name EX-PARIS-01
set vlans SERVEURS vlan-id 30
set interfaces ge-0/0/12 unit 0 family ethernet-switching interface-mode access vlan members SERVEURS
set interfaces ge-0/0/47 unit 0 family ethernet-switching interface-mode trunk vlan members [ 20 30 ]
set chassis aggregated-devices ethernet device-count 4
set interfaces ge-0/0/48 ether-options 802.3ad ae0
set interfaces ae0 aggregated-ether-options lacp active
set routing-options static route 0.0.0.0/0 next-hop 10.0.99.1
delete interfaces ge-0/0/5 disable
show | compare
commit check
commit confirmed 5 comment "Ajout VLAN 30"
commit
rollback 1
exit
```

## SRX (sécurité)

```junos
show security zones
show security policies hit-count
show security flow session source-prefix 10.0.20.15
show security nat source rule all
show security nat destination rule all
show security match-policies from-zone trust to-zone untrust source-ip 10.0.20.15 destination-ip 8.8.8.8 source-port 50000 destination-port 443 protocol tcp
show security ike security-associations
show security ipsec security-associations
show chassis cluster status
clear security flow session source-prefix 10.0.20.15
```

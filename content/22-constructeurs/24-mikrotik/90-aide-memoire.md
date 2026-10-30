---
title: MikroTik RouterOS — aide-mémoire des commandes
description: Commandes RouterOS (v7) avec exemples — système, identité, utilisateurs et services, interfaces, pont et VLAN, adresses, DHCP, routes, pare-feu (filter, nat, listes d'adresses), WireGuard et IPsec, outils (ping, traceroute, torch, sniffer), sauvegarde, export et mise à jour.
tags: [aide-mémoire, mikrotik, routeros, winbox, firewall, wireguard]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-routeros-cli-winbox|RouterOS, CLI et Winbox]] et [[02-parefeu-vpn-routage|pare-feu, VPN et routage]].

## Système et accès

```routeros
/system resource print
/system identity set name=RT-PARIS
/user add name=jdupont group=full password=MotDePasseLongEtUnique
/user remove admin
/ip service print
/ip service disable telnet,ftp,www,api
/ip service set ssh address=10.0.99.0/24
/ip service set winbox address=10.0.99.0/24
/tool mac-server set allowed-interface-list=none
/system ntp client set enabled=yes servers=10.0.10.123
/system clock set time-zone-name=Europe/Paris
```

## Interfaces, pont, VLAN et adresses

```routeros
/interface print
/interface bridge add name=bridge1 vlan-filtering=no
/interface bridge port add bridge=bridge1 interface=ether2 pvid=20
/interface bridge vlan add bridge=bridge1 vlan-ids=20 tagged=bridge1,ether5 untagged=ether2
/interface vlan add name=vlan20 vlan-id=20 interface=bridge1
/interface bridge set bridge1 vlan-filtering=yes
/ip address add address=10.0.20.1/24 interface=vlan20
/ip pool add name=pool-vlan20 ranges=10.0.20.100-10.0.20.199
/ip dhcp-server add name=dhcp-vlan20 interface=vlan20 address-pool=pool-vlan20
/ip dhcp-server network add address=10.0.20.0/24 gateway=10.0.20.1 dns-server=10.0.10.53
/ip dhcp-server lease print
/ip route add dst-address=0.0.0.0/0 gateway=203.0.113.1
/ip route print where active
```

## Pare-feu

```routeros
/ip firewall filter add chain=input connection-state=established,related action=accept
/ip firewall filter add chain=input connection-state=invalid action=drop
/ip firewall filter add chain=input src-address-list=ADMIN protocol=tcp dst-port=22,8291 action=accept
/ip firewall filter add chain=input in-interface-list=WAN action=drop
/ip firewall address-list add list=ADMIN address=10.0.99.0/24
/ip firewall nat add chain=srcnat out-interface-list=WAN action=masquerade
/ip firewall nat add chain=dstnat in-interface-list=WAN protocol=tcp dst-port=443 action=dst-nat to-addresses=10.0.30.10 to-ports=443
/ip firewall filter print stats
/ip firewall connection print where src-address~"10.0.20.15"
```

## VPN

```routeros
/interface wireguard add name=wg0 listen-port=13231
/interface wireguard peers add interface=wg0 public-key="CLE_PUBLIQUE_DU_PAIR" allowed-address=10.99.0.2/32
/ip address add address=10.99.0.1/24 interface=wg0
/ip ipsec active-peers print
/ip ipsec installed-sa print
```

## Outils, sauvegarde et mise à jour

```routeros
/ping 10.0.20.15 count=5
/tool traceroute 8.8.8.8
/tool torch interface=ether1
/tool sniffer quick ip-address=10.0.20.15
/log print where topics~"firewall"
/export file=config-rt-paris
/system backup save name=sauvegarde-rt-paris password=MotDePasseSauvegarde
/system package update check-for-updates
/system package update install
/system routerboard upgrade
```

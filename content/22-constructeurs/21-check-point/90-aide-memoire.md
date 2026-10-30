---
title: Check Point (Gaia) — aide-mémoire des commandes
description: Commandes Check Point avec exemples — Gaia Clish (interfaces, VLAN, routes, DNS, NTP, utilisateurs, sauvegarde), mode expert, API de gestion mgmt_cli (objets, règles, publication, installation de politique), diagnostic (fw stat, cpstat, cpview, fw ctl zdebug, fw monitor, tables), SecureXL, ClusterXL, VPN, licences.
tags: [aide-mémoire, check point, gaia, clish, mgmt_cli, fw monitor, clusterxl]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-gaia-smartconsole|Gaia et SmartConsole]].

## Gaia Clish

```clish
show version all
show interfaces all
set interface eth1 ipv4-address 10.0.20.254 mask-length 24
set interface eth1 state on
add interface eth2 vlan 30
set interface eth2.30 ipv4-address 10.0.30.254 mask-length 24
set static-route default nexthop gateway address 203.0.113.1 on
set static-route 10.50.0.0/16 nexthop gateway address 10.0.20.1 on
show route
set dns primary 10.0.10.53
set ntp server primary 10.0.10.123 version 4
set ntp active on
add user jdupont uid 2001 homedir /home/jdupont
set user jdupont password
add rba user jdupont roles adminRole
add backup local
show backups
save config
expert
```

## API de gestion (mgmt_cli)

```bash
mgmt_cli login user admin > id.txt
mgmt_cli add host name SRV-WEB ip-address 10.0.30.10 -s id.txt
mgmt_cli add network name NET-LAN subnet 10.0.20.0 mask-length 24 -s id.txt
mgmt_cli add access-rule layer "Network" position top name "LAN vers web" source "NET-LAN" destination "SRV-WEB" service "https" action "Accept" track.type "Log" -s id.txt
mgmt_cli show access-rulebase name "Network" limit 20 -s id.txt --format json
mgmt_cli publish -s id.txt
mgmt_cli install-policy policy-package "Standard" targets.1 "FW-PARIS" -s id.txt
mgmt_cli logout -s id.txt
```

## Diagnostic (mode expert)

```bash
fw stat
cpstat fw
cpview
fw ctl zdebug + drop | grep 10.0.20.15
fw monitor -F "10.0.20.15,0,0,0,0"
fw tab -t connections -s
fwaccel stat
cphaprob state
cphaprob -a if
vpn tu
cplic print
cpinfo
```

---
title: Arista EOS — aide-mémoire des commandes
description: Commandes Arista EOS avec exemples — modes, sessions de configuration (diffs, commit timer), points de reprise, VRF de gestion, comptes et AAA, SSH et eAPI, VLAN et ports, MLAG, état et dépannage (interfaces, compteurs, LLDP, port-channel, spanning-tree, routes, BGP), shell Bash, ZTP.
tags: [aide-mémoire, arista, eos, mlag, configure session, eapi]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-eos-cloudvision|EOS et CloudVision]].

## Configuration sûre

```eos
enable
configure session AJOUT-VLAN30
vlan 30
   name SERVEURS
interface Ethernet12
   switchport access vlan 30
show session-config diffs
commit timer 00:05:00
configure session AJOUT-VLAN30 commit
configure checkpoint save AVANT-MAINTENANCE
configure replace checkpoint:AVANT-MAINTENANCE
show running-config diffs
write memory
```

## Gestion

```eos
vrf instance MGMT
interface Management1
   vrf MGMT
   ip address 10.0.99.30/24
ip route vrf MGMT 0.0.0.0/0 10.0.99.1
username jdupont privilege 15 role network-admin secret MotDePasseLongEtUnique
no aaa root
ntp server vrf MGMT 10.0.10.123
logging vrf MGMT host 10.0.98.20
management api http-commands
   protocol https
   no shutdown
zerotouch cancel
```

```bash
curl -s -k -u automatisation https://10.0.99.30/command-api -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"runCmds","params":{"version":1,"cmds":["show version"],"format":"json"},"id":"1"}' | jq '.result[0].version'
```

## État et dépannage

```eos
show version
show interfaces status
show interfaces counters errors
show interfaces Ethernet12 transceiver
show lldp neighbors
show port-channel summary
show mlag
show mlag config-sanity
show mlag interfaces
show spanning-tree
show mac address-table address 0011.2233.4455
show ip route vrf all
show ip bgp summary
show logging last 30 minutes
show tech-support | redirect flash:tech.txt
bash ip -br addr
```

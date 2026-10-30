---
title: Cisco ASA — aide-mémoire des commandes
description: Commandes Cisco ASA avec exemples — état et interfaces, objets et ACL, NAT, packet-tracer, connexions et xlate, captures, journaux, VPN (IKEv2, AnyConnect), failover, sauvegarde et mise à jour, ASDM.
tags: [aide-mémoire, cisco, asa, packet-tracer, nat, failover, anyconnect]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-acces-interfaces|accès et interfaces]], [[02-objets-nat-acl|objets, NAT et ACL]] et [[03-vpn-failover-depannage|VPN, failover et dépannage]].

## État et configuration

```asa
show version
show interface ip brief
show nameif
show route
show running-config object
show running-config access-list
show running-config nat
show access-list OUTSIDE_IN
show nat detail
show xlate
show conn count
show conn address 10.0.20.15
show resource usage
show cpu usage
```

## Dépannage

```asa
packet-tracer input inside tcp 10.0.20.15 50000 8.8.8.8 443 detailed
capture CAP interface inside match ip host 10.0.20.15 any
show capture CAP
copy /pcap capture:CAP tftp://10.0.99.30/cap.pcap
no capture CAP
show asp drop
show logging | include 10.0.20.15
clear conn address 10.0.20.15
```

## VPN et failover

```asa
show crypto ikev2 sa
show crypto ipsec sa peer 198.51.100.20
show vpn-sessiondb summary
show vpn-sessiondb anyconnect
vpn-sessiondb logoff name amartin noconfirm
show failover
show failover state
failover active
no failover active
```

## Sauvegarde et mise à jour

```asa
write memory
copy running-config tftp://10.0.99.30/asa-paris.cfg
backup location tftp://10.0.99.30/asa-backup
copy tftp://10.0.99.30/asa9-20-3-smp-k8.bin disk0:
boot system disk0:/asa9-20-3-smp-k8.bin
show bootvar
asdm image disk0:/asdm-7221.bin
```

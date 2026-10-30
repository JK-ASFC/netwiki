---
title: Fortinet routage, SD-WAN, FortiSwitch et FortiAP — aide-mémoire
description: Commandes FortiOS pour le routage dynamique et le SD-WAN avec exemples (BGP, OSPF, état des liens SD-WAN, SLA, règles), FortiSwitch géré par FortiLink et FortiAP (inventaire, état, clients Wi-Fi), FortiManager (appareils, installations).
tags: [aide-mémoire, fortinet, sd-wan, bgp, fortiswitch, fortiap, fortimanager]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-routage-sdwan|routage et SD-WAN]] et [[02-fortiswitch-fortiap-fortimanager|FortiSwitch, FortiAP, FortiManager]].

```fortios
# Routage dynamique
get router info bgp summary
get router info bgp neighbors 203.0.113.1 advertised-routes
get router info ospf neighbor
get router info ospf interface
execute router clear bgp ip 203.0.113.1 soft
# SD-WAN
diagnose sys sdwan member
diagnose sys sdwan health-check
diagnose sys sdwan service
diagnose sys sdwan intf-sla-log wan1
get router info routing-table all
# FortiSwitch (FortiLink)
execute switch-controller get-conn-status
diagnose switch-controller switch-info port-stats FS1E48T000000 port12
execute switch-controller switch-action restart FS1E48T000000
# FortiAP
diagnose wireless-controller wlac -d wtp
get wireless-controller wtp-status
diagnose wireless-controller wlac -d sta online
```

```text
# FortiManager (CLI)
diagnose dvm device list
diagnose dvm task list
execute fmprofile list-profiles
```

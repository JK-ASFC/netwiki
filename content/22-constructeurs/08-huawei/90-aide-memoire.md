---
title: Huawei VRP — aide-mémoire des commandes
description: Commandes Huawei VRP avec exemples — vues, enregistrement et validation (commit sur VRP8), VLAN et ports, Eth-Trunk, STP, iStack/CSS, routage (statique, OSPF, BGP), pare-feu USG (sessions, politiques), journaux, sauvegarde et mise à jour.
tags: [aide-mémoire, huawei, vrp, eth-trunk, istack, usg]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-vrp-bases-commutation|VRP et commutation]] et [[02-routage-securite-outils|routage, sécurité et outils]].

```huawei
# Vues, enregistrement
system-view
quit
return
save
display current-configuration
display current-configuration interface GigabitEthernet0/0/12
display saved-configuration
display version
display device
# VLAN, ports, agrégats
display vlan
display port vlan
display interface brief
display eth-trunk 1
display mac-address
display lldp neighbor brief
display stp brief
display stack
# Routage
display ip interface brief
display ip routing-table
display ospf peer brief
display bgp peer
# Pare-feu USG
display firewall session table
display security-policy rule all
display hrp state
# Journaux et diagnostic
display logbuffer
display trapbuffer
display diagnostic-information
# Sauvegarde et mise à jour (vue utilisateur)
tftp 10.0.99.30 put vrpcfg.zip sw-huawei.zip
startup system-software S5735-V200R022C00.cc
display startup
reboot
```

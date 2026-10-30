---
title: Alcatel-Lucent OmniSwitch — aide-mémoire des commandes
description: Commandes ALE OmniSwitch (AOS 8) avec exemples — état et versions, VLAN et appartenance des ports, linkagg, spanning tree, Virtual Chassis, routage IP, LLDP, PoE, journaux (swlog), enregistrement et certification de la configuration, mise à jour avec retour arrière.
tags: [aide-mémoire, alcatel, ale, omniswitch, aos, linkagg, virtual chassis]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-omniswitch-cli|OmniSwitch]] et [[02-omnivista-webview-depannage|OmniVista et dépannage]].

```aos
show system
show microcode
show chassis
show running-directory
show configuration snapshot
show vlan
show vlan members
show interfaces status
show interfaces port 1/1/12
show linkagg
show linkagg port
show spantree
show virtual-chassis topology
show virtual-chassis consistency
show ip interface
show ip routes
show lldp remote-system
show lanpower slot 1/1
show mac-learning port 1/1/12
show log swlog
write memory
copy running certified
reload from working rollback-timeout 15
```

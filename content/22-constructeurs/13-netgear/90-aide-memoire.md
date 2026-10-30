---
title: Commutateurs Netgear — aide-mémoire des commandes
description: Commandes des commutateurs Netgear M4250/M4300/M4350 (CLI de style Cisco) avec exemples — état, VLAN, ports, LAG, spanning tree, LLDP, PoE, profils AV, sauvegarde et mise à jour ; repères pour les gammes Smart et Insight.
tags: [aide-mémoire, netgear, m4300, vlan, poe]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-commutateurs-geres|commutateurs Netgear]].

```netgear
enable
show hardware
show running-config
show vlan brief
show interfaces status all
show port-channel all
show spanning-tree summary
show lldp remote-device all
show poe port info all
show mac-addr-table interface 1/0/12
show logging buffered
write memory
copy nvram:startup-config tftp://10.0.99.30/m4300.cfg
copy tftp://10.0.99.30/m4300-14.0.2.26.stk backup
boot system backup
reload
```

Gammes Smart (GS, GC) : administration par l'interface web uniquement (ou Netgear Insight dans le cloud) ; utilitaire de découverte **NETGEAR Switch Discovery Tool**.

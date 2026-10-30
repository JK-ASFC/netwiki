---
title: Aruba AOS-S et AOS-CX — aide-mémoire des commandes
description: Commandes Aruba ArubaOS-Switch (ProVision) et AOS-CX avec exemples — état, VLAN et ports, agrégats (trunk/LAG), spanning tree, LLDP, PoE, VSF/VSX, journaux, sauvegarde et restauration, points de reprise (checkpoint) AOS-CX, mise à jour du logiciel.
tags: [aide-mémoire, aruba, aos-s, aos-cx, vsx, vlan, lacp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-aos-switch-cli|ArubaOS-Switch]] et [[02-aos-cx-cli|AOS-CX]].

## ArubaOS-Switch (ProVision)

```aoss
show system
show version
show vlans
show vlans ports 1-48 detail
show interfaces brief
show trunks
show lacp
show spanning-tree
show lldp info remote-device
show power-over-ethernet brief
show mac-address 12
show logging -r
show vsf
write memory
copy startup-config tftp 10.0.99.30 sw-aruba.cfg
copy tftp flash 10.0.99.30 WC_16_11_0021.swi primary
boot system flash primary
```

## AOS-CX

```aoscx
show system
show version
show vlan
show interface brief
show lag
show lacp interfaces
show spanning-tree
show lldp neighbor-info
show power-over-ethernet
show mac-address-table vlan 20
show vsx status
show vsx config-consistency
show logging -r
show running-config diff startup-config
checkpoint diff startup-config running-config
copy running-config startup-config
copy running-config checkpoint avant-maj
copy checkpoint avant-maj running-config
copy running-config tftp://10.0.99.30/sw-cx.cfg cli
copy tftp://10.0.99.30/ArubaOS-CX_6300_10_13_1010.swi primary
boot system primary
```

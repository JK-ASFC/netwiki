---
title: Commutateurs D-Link — aide-mémoire des commandes
description: Commandes des commutateurs D-Link gérés avec exemples — CLI des séries DGS (style Cisco des modèles récents et syntaxe historique), état, VLAN et ports, LACP, spanning tree, LLDP, PoE, sauvegarde (TFTP), mise à jour du micrologiciel, interface web et réinitialisation.
tags: [aide-mémoire, d-link, dgs, vlan, tftp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-commutateurs-web-cli|commutateurs D-Link]]. Les gammes récentes (DGS-1250, DGS-1510, DGS-3130) utilisent une CLI proche de Cisco ; les anciennes une syntaxe « create vlan / config vlan ».

## CLI de style Cisco (gammes récentes)

```dlink
show version
show running-config
show vlan
show interfaces status
show channel-group
show spanning-tree
show lldp neighbors
show poe power-inline status
show mac-address-table interface ethernet 1/0/12
copy running-config startup-config
copy running-config tftp: //10.0.99.30/dgs-1510.cfg
```

## Syntaxe historique (anciennes gammes)

```dlink
show switch
show vlan
show ports
create vlan utilisateurs tag 20
config vlan utilisateurs add untagged 1-24
config vlan utilisateurs add tagged 25-28
save
upload cfg_toTFTP 10.0.99.30 dest_file dgs-ancien.cfg
download firmware_fromTFTP 10.0.99.30 src_file DGS-1210_7.00.bin
```

Interface web : adresse par défaut souvent `10.90.90.90` (selon modèle) ; utilitaire de découverte **D-Link Network Assistant**.

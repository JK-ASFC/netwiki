---
title: HPE Comware — aide-mémoire des commandes
description: Commandes HPE Comware 7 avec exemples — vues et sauvegarde, VLAN et ports, agrégats (Bridge-Aggregation), STP, IRF, LLDP, routage et interfaces de VLAN, sécurité d'accès, sauvegarde de configuration (TFTP/FTP), mise à jour du logiciel, diagnostic.
tags: [aide-mémoire, hpe, comware, irf, vlan, bridge-aggregation]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-cli-comware|CLI Comware]].

```comware
# Vues et enregistrement
system-view
quit
return
save force
display current-configuration
display current-configuration interface GigabitEthernet1/0/12
display saved-configuration
display version
display device
# VLAN, ports, agrégats
display vlan brief
display interface brief
display port trunk
display mac-address interface GigabitEthernet1/0/12
display link-aggregation summary
display link-aggregation verbose Bridge-Aggregation 1
# Spanning tree, voisins
display stp brief
display stp root
display lldp neighbor-information list
# IRF
display irf
display irf topology
display irf link
# Routage
display ip interface brief
display ip routing-table
display ospf peer brief
# Sécurité et journaux
display dot1x connection
display mac-authentication
display logbuffer reverse
display diagnostic-information
# Sauvegarde et mise à jour (vue utilisateur)
tftp 10.0.99.30 put startup.cfg sw-comware.cfg
boot-loader file flash:/S5130-CMW710-R3600.ipe all main
display boot-loader
reboot
```

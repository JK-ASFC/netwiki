---
title: Correspondance des commandes — administration et commutation
description: Tables d'équivalence des commandes entre constructeurs pour l'administration et la commutation — Cisco IOS, ArubaOS-Switch (ProVision), Aruba AOS-CX, HPE Comware, Huawei VRP, Juniper Junos et Alcatel-Lucent OmniSwitch (AOS 8) — modes, enregistrement, affichage de la configuration, VLAN, ports d'accès et trunk, VLAN natif, agrégats LACP, spanning tree, LLDP, table MAC, interfaces de VLAN, route par défaut, SSH, journaux ; vocabulaire comparé et outils graphiques de chaque constructeur.
tags: [correspondance, cisco, aruba, comware, huawei, junos, alcatel, commandes, vlan]
icon: copy
---

Un architecte réseau jongle souvent avec plusieurs constructeurs. Ces tables donnent l'**équivalent d'une même tâche** d'une CLI à l'autre ; les détails et les variantes sont dans les pages de chaque constructeur. Les CLI d'**Arista EOS**, **Cisco NX-OS**, Ubiquiti EdgeSwitch, Netgear, TP-Link JetStream et D-Link sont proches de Cisco IOS : la colonne Cisco s'y applique en grande partie.

## Vocabulaire

| Notion | Cisco | Aruba / HPE ProVision | HPE Comware / Huawei | Junos | ALE |
| --- | --- | --- | --- | --- | --- |
| Lien 802.1Q multi-VLAN | trunk | port *tagged* | trunk (ou hybrid) | `interface-mode trunk` | port *tagged* |
| Agrégat de liens | EtherChannel, `Port-channel` | **trunk** (`trk1`), LAG (AOS-CX) | `Bridge-Aggregation` / `Eth-Trunk` | `ae0` | `linkagg` |
| Interface routée de VLAN (SVI) | `interface Vlan` | `vlan X ip address` / `interface vlan` | `Vlan-interface` / `Vlanif` | `irb.X` | `ip interface … vlan X` |
| Empilage | StackWise, VSS | Backplane stacking, VSF, VSX | **IRF** / iStack, CSS | Virtual Chassis | Virtual Chassis |
| Annuler une commande | `no` | `no` | `undo` | `delete` | `no` |

## Administration — Cisco et Aruba/HPE

| Tâche | Cisco IOS | ArubaOS-Switch | AOS-CX | HPE Comware |
| --- | --- | --- | --- | --- |
| Entrer en configuration | `configure terminal` | `configure` | `configure terminal` | `system-view` |
| Remonter / sortir | `exit` ; `end` | `exit` | `exit` ; `end` | `quit` ; `return` |
| Enregistrer | `copy running-config startup-config` | `write memory` | `write memory` | `save` |
| Configuration active | `show running-config` | `show running-config` | `show running-config` | `display current-configuration` |
| Configuration enregistrée | `show startup-config` | `show config` | `show startup-config` | `display saved-configuration` |
| Version | `show version` | `show version` ; `show system` | `show version` | `display version` |
| Nom de l'équipement | `hostname SW-PARIS` | `hostname SW-PARIS` | `hostname SW-PARIS` | `sysname SW-PARIS` |
| État des interfaces | `show ip interface brief` ; `show interfaces status` | `show interfaces brief` | `show interface brief` | `display interface brief` |
| Journal | `show logging` | `show logging -r` | `show logging` | `display logbuffer` |
| Redémarrer | `reload` | `reload` ; `boot system flash primary` | `boot system` | `reboot` |

## Commutation — Cisco et Aruba/HPE

| Tâche | Cisco IOS | ArubaOS-Switch | AOS-CX | HPE Comware |
| --- | --- | --- | --- | --- |
| Créer un VLAN | `vlan 20` ; `name UTILISATEURS` | `vlan 20` ; `name UTILISATEURS` | `vlan 20` ; `name UTILISATEURS` | `vlan 20` ; `name UTILISATEURS` |
| Port d'accès | `switchport mode access` ; `switchport access vlan 20` | `vlan 20 untagged 5` | `vlan access 20` | `port link-type access` ; `port access vlan 20` |
| Trunk | `switchport mode trunk` ; `switchport trunk allowed vlan 20,40` | `vlan 40 tagged 49` | `vlan trunk allowed 20,40` | `port link-type trunk` ; `port trunk permit vlan 20 40` |
| VLAN natif | `switchport trunk native vlan 999` | `vlan 999 untagged 49` | `vlan trunk native 999` | `port trunk pvid vlan 999` |
| VLAN voix | `switchport voice vlan 40` | `vlan 40 voice` | `voice` dans le VLAN | `voice-vlan 40 enable` |
| Agrégat LACP | `channel-group 1 mode active` | `trunk 49-50 trk1 lacp` | `interface lag 1` ; `lacp mode active` ; `lag 1` sur les ports | `interface bridge-aggregation 1` ; `link-aggregation mode dynamic` ; `port link-aggregation group 1` |
| Spanning tree | `spanning-tree mode rapid-pvst` | `spanning-tree` (MSTP) | `spanning-tree` (MSTP) | `stp global enable` ; `stp mode rstp` |
| Port d'extrémité | `spanning-tree portfast` | `spanning-tree 5 admin-edge-port` | `spanning-tree port-type admin-edge` | `stp edged-port` |
| Table MAC | `show mac address-table` | `show mac-address` | `show mac-address-table` | `display mac-address` |
| Voisins | `show cdp neighbors` ; `show lldp neighbors` | `show lldp info remote-device` | `show lldp neighbor-info` | `display lldp neighbor-information list` |
| Interface de VLAN | `interface vlan 99` ; `ip address 10.0.99.2 255.255.255.0` | `vlan 99` ; `ip address 10.0.99.2/24` | `interface vlan 99` ; `ip address 10.0.99.2/24` | `interface vlan-interface 99` ; `ip address 10.0.99.2 24` |
| Route par défaut | `ip route 0.0.0.0 0.0.0.0 10.0.99.1` | `ip route 0.0.0.0/0 10.0.99.1` | `ip route 0.0.0.0/0 10.0.99.1` | `ip route-static 0.0.0.0 0 10.0.99.1` |
| SSH | `crypto key generate rsa modulus 2048` ; `ip ssh version 2` ; `transport input ssh` (vty) | `crypto key generate ssh` ; `ip ssh` | `ssh server vrf mgmt` | `public-key local create rsa` ; `ssh server enable` |

## Administration et commutation — Huawei, Juniper, ALE

| Tâche | Huawei VRP | Juniper Junos | ALE OmniSwitch (AOS 8) |
| --- | --- | --- | --- |
| Entrer en configuration | `system-view` | `configure` | Aucune : commandes appliquées directement |
| Valider / enregistrer | `save` (et `commit` sur VRP8) | `commit` | `write memory` ; `copy running certified` |
| Configuration active | `display current-configuration` | `show configuration` | `show configuration snapshot` |
| Version | `display version` | `show version` | `show microcode` ; `show system` |
| Nom de l'équipement | `sysname SW-PARIS` | `set system host-name SW-PARIS` | `system name SW-PARIS` |
| Annuler | `undo …` | `delete …` ; `rollback 1` | `no …` |
| État des interfaces | `display interface brief` | `show interfaces terse` | `show interfaces status` |
| Créer un VLAN | `vlan 20` ; `description UTILISATEURS` | `set vlans UTILISATEURS vlan-id 20` | `vlan 20 admin-state enable name "UTILISATEURS"` |
| Port d'accès | `port link-type access` ; `port default vlan 20` | `set interfaces ge-0/0/5 unit 0 family ethernet-switching interface-mode access vlan members UTILISATEURS` | `vlan 20 members port 1/1/5 untagged` |
| Trunk | `port link-type trunk` ; `port trunk allow-pass vlan 20 40` | `… interface-mode trunk vlan members [ UTILISATEURS VOIX ]` | `vlan 40 members port 1/1/49 tagged` |
| VLAN natif | `port trunk pvid vlan 999` | `set interfaces xe-0/1/0 native-vlan-id 999` | `vlan 999 members port 1/1/49 untagged` |
| Agrégat LACP | `interface Eth-Trunk 1` ; `mode lacp` ; `eth-trunk 1` sur les ports | `set interfaces xe-0/1/0 ether-options 802.3ad ae0` ; `set interfaces ae0 aggregated-ether-options lacp active` | `linkagg lacp agg 1 size 2 actor admin-key 1` ; `linkagg lacp port 1/1/49-50 actor admin-key 1` |
| Spanning tree | `stp mode rstp` ; `stp enable` | `set protocols rstp` | `spantree mode flat` ; `spantree protocol mstp` |
| Port d'extrémité | `stp edged-port enable` | `set protocols rstp interface ge-0/0/5 edge` | `spantree port 1/1/5 admin-edge enable` |
| Table MAC | `display mac-address` | `show ethernet-switching table` | `show mac-learning` |
| Voisins | `display lldp neighbor brief` | `show lldp neighbors` | `show lldp remote-system` |
| Interface de VLAN | `interface Vlanif 99` ; `ip address 10.0.99.2 24` | `set interfaces irb unit 99 family inet address 10.0.99.2/24` ; `set vlans ADMIN l3-interface irb.99` | `ip interface "ADMIN" address 10.0.99.2 mask 255.255.255.0 vlan 99` |
| Route par défaut | `ip route-static 0.0.0.0 0 10.0.99.1` | `set routing-options static route 0.0.0.0/0 next-hop 10.0.99.1` | `ip static-route 0.0.0.0/0 gateway 10.0.99.1` |
| SSH | `stelnet server enable` ; `protocol inbound ssh` (vty) | `set system services ssh` | `ip service ssh admin-state enable` ; `aaa authentication ssh local` |
| Journal | `display logbuffer` | `show log messages` | `show log swlog` |
| Redémarrer | `reboot` | `request system reboot` | `reload from working no rollback-timeout` |

## Outils graphiques par constructeur

| Constructeur | Interface locale | Gestion centralisée sur site | Cloud |
| --- | --- | --- | --- |
| Cisco | Web UI (Catalyst 9000), Cisco Configuration Professional (ancien) | **Catalyst Center** (ex-DNA Center), Prime Infrastructure (fin de vie) | **Meraki Dashboard** |
| HPE Aruba | Web UI (AOS-S, AOS-CX) | AirWave (fin de vie), **NetEdit** (AOS-CX) | **Aruba Central** (HPE Aruba Networking Central) |
| HPE Comware / H3C | Web UI | **IMC** (Intelligent Management Center) | — |
| Huawei | Web UI | **iMaster NCE** (ex-eSight) | iMaster NCE-Campus |
| Juniper | **J-Web** | Junos Space, Apstra (centre de données) | **Juniper Mist** |
| ALE | **WebView** | **OmniVista 2500** | OmniVista Cirrus |
| TP-Link | Web UI | **Omada** (contrôleur logiciel ou matériel) | Omada Cloud |
| Ubiquiti | — | **UniFi Network** | UniFi Site Manager |
| Fortinet | Web UI de la FortiGate (FortiLink) | **FortiManager** | FortiCloud |
| Arista | — | **CloudVision** | CloudVision as-a-Service |

Pages détaillées : [[02-cisco-ios-bases/01-cli-fondamentaux|Cisco IOS]], [[07-aruba/01-aos-switch-cli|ArubaOS-Switch]], [[07-aruba/02-aos-cx-cli|AOS-CX]], [[06-hpe-comware/01-cli-comware|Comware]], [[08-huawei/01-vrp-bases-commutation|Huawei VRP]], [[23-juniper/01-junos-cli-commutation|Junos]], [[09-alcatel-lucent-enterprise/01-omniswitch-cli|OmniSwitch]]. Suite : [[02-routage-securite-diagnostic|routage, sécurité et diagnostic]].

---
title: VRP — bases et commutation
description: Équipements Huawei sous VRP (commutateurs CloudEngine S, routeurs NetEngine/AR, pare-feu USG/HiSecEngine) — vues et commandes (system-view, display, undo, commit sur VRP8), accès console et STelnet (SSH), AAA et utilisateurs locaux, VLAN et types de ports (access, trunk, hybrid), Eth-Trunk (LACP), MSTP, iStack et CSS, interfaces Vlanif, sauvegarde et mise à jour.
tags: [huawei, vrp, cloudengine, eth-trunk, istack, vlanif, system-view, commutateur]
icon: terminal
---

**VRP** (*Versatile Routing Platform*) est le système de tous les équipements réseau Huawei : commutateurs **CloudEngine S** (accès/campus) et **CE** (centre de données), routeurs **NetEngine AR** et NE, pare-feu **USG / HiSecEngine**. Sa CLI est très proche de [[06-hpe-comware/01-cli-comware|Comware]] (origine commune).

## Vues

```huawei
<HUAWEI>                        # vue utilisateur
<HUAWEI> system-view
[HUAWEI]                        # vue système
[HUAWEI] interface GigabitEthernet0/0/1
[HUAWEI-GigabitEthernet0/0/1] quit
[HUAWEI] return
<HUAWEI> save
```

| Opération | Commande |
| --- | --- |
| Afficher | `display current-configuration`, `display saved-configuration`, `display interface brief`, `display vlan` |
| Annuler | `undo <commande>` |
| Enregistrer | `save` (confirmation `y`) |
| Filtrer | `display current-configuration \| include vlan`, `\| begin interface` |
| Aide | `?`, <kbd>Tab</kbd> |

> [!IMPORTANT]
> Sur **VRP 8** (CloudEngine CE, NetEngine récents), la configuration est **en deux temps** : les modifications sont mises en attente puis appliquées par `commit` (comme Junos). Sur VRP 5 (commutateurs S « historiques », AR), elles s'appliquent immédiatement.

## Accès et sécurisation

```huawei
sysname SW-ACCES-B2
clock timezone Paris add 01:00:00
ntp-service unicast-server 10.0.10.123
#
aaa
 local-user admin password irreversible-cipher MotDePasseAdminTresLong
 local-user admin privilege level 15
 local-user admin service-type ssh terminal
#
stelnet server enable
ssh server-source -i Vlanif99
# (taille 3072)
rsa local-key-pair create
ssh user admin authentication-type password
ssh user admin service-type stelnet
#
user-interface vty 0 4
 authentication-mode aaa
 protocol inbound ssh
 # ACL de base limitant les sources d'administration
 acl 2000 inbound
user-interface console 0
 authentication-mode aaa
#
acl number 2000
 rule 5 permit source 10.0.99.0 0.0.0.255
 rule 10 deny
#
undo telnet server enable
info-center loghost 10.0.98.20
snmp-agent sys-info version v3
```

## VLAN et ports

```huawei
vlan batch 10 20 30 99
vlan 20
 description UTILISATEURS
#
interface GigabitEthernet0/0/10
 port link-type access
 port default vlan 20
 stp edged-port enable
#
interface XGigabitEthernet0/0/1
 port link-type trunk
 port trunk allow-pass vlan 10 20 30 99
 undo port trunk allow-pass vlan 1
 port trunk pvid vlan 998
#
interface GigabitEthernet0/0/20
 port link-type hybrid
 port hybrid tagged vlan 30
 port hybrid untagged vlan 20
 port hybrid pvid vlan 20
#
display vlan
display port vlan
```

Le type de port par défaut de nombreux commutateurs Huawei est **hybrid** (ou négocié) : définissez explicitement `access` ou `trunk`.

## Eth-Trunk (agrégation)

```huawei
interface Eth-Trunk1
 description Agrégat vers SW-COEUR
 mode lacp
 port link-type trunk
 port trunk allow-pass vlan 10 20 30 99
#
interface XGigabitEthernet0/0/1
 eth-trunk 1
interface XGigabitEthernet0/0/2
 eth-trunk 1
#
display eth-trunk 1
display lacp statistics eth-trunk 1
```

## Spanning Tree

```huawei
stp mode mstp
stp region-configuration
 region-name CAMPUS
 revision-level 1
 instance 1 vlan 10 20 30
 active region-configuration
stp instance 0 priority 4096
stp bpdu-protection
stp enable
display stp brief
```

## Empilement

| Technologie | Équipements | Principe |
| --- | --- | --- |
| **iStack** | Commutateurs S (accès/agrégation) | Empilement par ports dédiés ou de service |
| **CSS** | Commutateurs modulaires S12700 | Grappe de deux châssis |
| M-LAG | CloudEngine | Agrégat multi-châssis avec deux plans de contrôle |

```huawei
stack slot 0 priority 200
interface stack-port 0/1
 port interface XGigabitEthernet0/0/3 enable
display stack
```

## Interfaces Vlanif et routage

```huawei
interface Vlanif20
 ip address 10.0.20.1 255.255.255.0
 dhcp select relay
 dhcp relay server-ip 10.0.10.67
#
ip route-static 0.0.0.0 0.0.0.0 10.0.0.1
ospf 1 router-id 10.255.0.11
 area 0.0.0.0
  network 10.0.0.0 0.0.0.3
  network 10.0.20.0 0.0.0.255
display ip routing-table
display ospf peer brief
```

## Sauvegarde et mise à jour

```huawei
<HUAWEI> save
<HUAWEI> sftp 10.0.98.30                         # récupérer/envoyer des fichiers (ou tftp / ftp)
<HUAWEI> startup system-software S5735-L-V200R022C00SPC500.cc
<HUAWEI> display startup
<HUAWEI> reboot
```

Les correctifs (*patches*, fichiers `.pat`) s'appliquent souvent sans redémarrage : `patch load`, `patch active`, `patch run`.

Suite : [[02-routage-securite-outils|routage, sécurité et outils graphiques]].

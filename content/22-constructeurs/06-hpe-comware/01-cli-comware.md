---
title: CLI Comware 7 — bases, VLAN, agrégation et IRF
description: Commutateurs HPE FlexNetwork / FlexFabric sous Comware 7 (5130, 5140, 5510, 5710, 5940…) — vues utilisateur et système, aide, display/undo/save, accès console et SSH, utilisateurs locaux et schémas d'authentification, VLAN et types de ports (access, trunk, hybrid), agrégation (Bridge-Aggregation, LACP), Spanning Tree, IRF (empilement), interfaces VLAN et routage, sauvegarde et mise à jour, différences avec Cisco IOS.
tags: [hpe, comware, flexnetwork, irf, vlan, bridge-aggregation, system-view, commutateur]
icon: terminal
---

**Comware** est le système des commutateurs et routeurs HPE issus de H3C (gammes FlexNetwork, FlexFabric ; MSR pour les routeurs). Sa CLI rappelle celle de **Huawei VRP** ([[08-huawei/01-vrp-bases-commutation|Huawei]]) : `system-view`, `display`, `undo`, `save`. Le guide comparatif HPE (« Aruba HPE Networking and Cisco CLI Reference Guide ») met en regard Comware, ArubaOS-Switch et Cisco IOS ; un tableau d'équivalences est disponible dans [[01-correspondance-commandes/01-administration-commutation|correspondance des commandes]].

## Vues et navigation

```comware
<HPE>                             ! vue utilisateur (display, ping, save, reboot)
<HPE> system-view
[HPE]                             ! vue système (configuration)
[HPE] interface GigabitEthernet1/0/1
[HPE-GigabitEthernet1/0/1]        ! vue interface
[HPE-GigabitEthernet1/0/1] quit   ! remonter d'un niveau
[HPE] return                      ! retour en vue utilisateur (Ctrl+Z)
```

| Cisco IOS | Comware |
| --- | --- |
| `enable` / `configure terminal` | `system-view` |
| `show …` | `display …` |
| `no …` | `undo …` |
| `copy run start` / `write` | `save` (puis confirmation, ou `save force`) |
| `show running-config` | `display current-configuration` |
| `show startup-config` | `display saved-configuration` |
| `hostname` | `sysname` |
| `\| include` | `\| include` (et `\| begin`, `\| exclude`) |

Les modifications s'appliquent immédiatement (comme sur Cisco) ; `save` les rend persistantes.

## Accès et sécurisation

```comware
sysname SW-ACCES-B2
clock timezone Paris add 01:00:00
clock protocol ntp
ntp-service enable
ntp-service unicast-server 10.0.10.123
#
local-user admin class manage
 password simple MotDePasseAdminTresLong
 service-type ssh terminal
 authorization-attribute user-role network-admin
#
# (taille demandée : 3072)
public-key local create rsa
ssh server enable
line vty 0 63
 authentication-mode scheme
 protocol inbound ssh
 user-role network-operator
# console
line aux 0
 authentication-mode scheme
#
undo telnet server enable
undo ip http enable
# interface web en HTTPS (si utilisée)
ip https enable
info-center loghost 10.0.98.20
snmp-agent sys-info version v3
```

Les mots de passe saisis en `simple` sont stockés **chiffrés/hachés** dans la configuration. RADIUS/HWTACACS : `radius scheme` / `hwtacacs scheme` + `domain` (schéma AAA par domaine).

## VLAN et ports

```comware
vlan 10
 name SERVEURS
vlan 20
 name UTILISATEURS
vlan 30
 name TELEPHONIE
#
interface GigabitEthernet1/0/10
 port link-type access
 port access vlan 20
 # équivalent de PortFast
 stp edged-port
 # (avec la configuration voice-vlan globale / LLDP)
 voice-vlan 30 enable
#
interface Ten-GigabitEthernet1/0/49
 port link-type trunk
 port trunk permit vlan 10 20 30 99
 undo port trunk permit vlan 1
 # VLAN natif
 port trunk pvid vlan 998
#
interface GigabitEthernet1/0/20
 # hybride : plusieurs VLAN non étiquetés possibles (téléphonie, cas particuliers)
 port link-type hybrid
 port hybrid vlan 30 tagged
 port hybrid vlan 20 untagged
 port hybrid pvid vlan 20
#
display vlan brief
display port trunk
display interface brief
```

## Agrégation de liens

```comware
interface Bridge-Aggregation1
 description Agrégat vers SW-COEUR
 # LACP
 link-aggregation mode dynamic
 port link-type trunk
 port trunk permit vlan 10 20 30 99
#
interface range Ten-GigabitEthernet1/0/49 to Ten-GigabitEthernet1/0/50
 port link-aggregation group 1
#
display link-aggregation summary
display link-aggregation verbose Bridge-Aggregation 1
```

Le nom Cisco **EtherChannel/Port-channel** correspond à **Bridge-Aggregation** (niveau 2) ou **Route-Aggregation** (niveau 3) sous Comware.

## Spanning Tree

```comware
stp global enable
# ou rstp / pvst
stp mode mstp
stp region-configuration
 region-name CAMPUS
 revision-level 1
 instance 1 vlan 10 20 30
 active region-configuration
# sur le cœur
stp instance 0 to 1 priority 4096
# BPDU Guard global sur les ports « edged »
stp bpdu-protection
display stp brief
display stp root
```

## IRF (empilement)

**IRF** (*Intelligent Resilient Framework*) regroupe plusieurs commutateurs en un seul équipement logique (empilement par ports Ethernet ou dédiés) :

```comware
# Sur le membre 2 avant de le relier (renumérotation, redémarrage)
irf member 1 renumber 2
# Ports IRF (exemple sur le membre 1)
interface range Ten-GigabitEthernet1/0/51 to Ten-GigabitEthernet1/0/52
 shutdown
irf-port 1/2
 port group interface Ten-GigabitEthernet1/0/51
 port group interface Ten-GigabitEthernet1/0/52
interface range Ten-GigabitEthernet1/0/51 to Ten-GigabitEthernet1/0/52
 undo shutdown
irf-port-configuration active
# membre maître préféré
irf member 1 priority 32
#
display irf
display irf topology
display irf configuration
```

Prévoir une **détection de partition** (MAD : LACP, BFD ou ARP) pour éviter deux maîtres actifs en cas de rupture des liens IRF.

## Routage

```comware
interface Vlan-interface20
 ip address 10.0.20.1 255.255.255.0
 dhcp select relay
 dhcp relay server-address 10.0.10.67
ip route-static 0.0.0.0 0.0.0.0 10.0.0.1
ospf 1 router-id 10.255.0.11
 area 0.0.0.0
  network 10.0.0.0 0.0.0.3
  network 10.0.20.0 0.0.0.255
display ip routing-table
display ospf peer brief
```

## Sauvegarde et mise à jour

```comware
<HPE> save force
<HPE> backup startup-configuration to 10.0.98.30 SW-ACCES-B2.cfg     ! TFTP
<HPE> scp 10.0.98.30 get images/5130EI-CMW710-R3612.ipe              ! récupérer l'image
<HPE> boot-loader file flash:/5130EI-CMW710-R3612.ipe all main       ! tous les membres IRF
<HPE> display boot-loader
<HPE> reboot
```

Suite : [[02-interface-web-imc|interface web et outils de gestion]].

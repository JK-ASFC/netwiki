---
title: ArubaOS-Switch (ex-ProCurve) — CLI
description: Commutateurs Aruba 2530, 2540, 2930F/M, 3810, 5400R sous ArubaOS-Switch (ex-ProVision/ProCurve) — modes et commandes, différences de logique avec Cisco (VLAN « tagged/untagged » configurés dans le contexte VLAN, trunks = agrégats), sécurisation (opérateur/manager, SSH, RADIUS), VLAN, agrégation LACP, Spanning Tree, VSF et backplane stacking, routage, 802.1X, sauvegarde et mise à jour.
tags: [aruba, aos-s, arubaos-switch, procurve, provision, vlan, trunk, vsf]
icon: terminal
---

**ArubaOS-Switch** (AOS-S, anciennement ProVision / ProCurve chez HP) équipe une grande partie des commutateurs d'accès HPE/Aruba installés. Sa logique diffère de Cisco sur deux points essentiels (voir le guide comparatif HPE et la page [[01-correspondance-commandes/01-administration-commutation|correspondance des commandes]]) :

| Notion | Cisco | ArubaOS-Switch |
| --- | --- | --- |
| Port dans un VLAN sans étiquette | `switchport access vlan 20` | `vlan 20` → `untagged 10` |
| Port portant plusieurs VLAN étiquetés | *trunk* | `tagged` dans chaque VLAN |
| Agrégation de liens | EtherChannel / Port-channel | **trunk** (`trk1`) |
| Adresse IP de niveau 3 | `interface Vlan20` | Dans le contexte `vlan 20` (`ip address`) |

## Modes

```aoss
HP-2930F> enable
HP-2930F# configure terminal
HP-2930F(config)# vlan 20
HP-2930F(vlan-20)# exit
HP-2930F(config)# interface 1/1/10          ! (2930F/3810 empilés) ou « interface 10 » sur un commutateur seul
HP-2930F(eth-10)# end
HP-2930F# write memory
```

`show running-config`, `show config` (sauvegardée), `show interfaces brief`, `show vlans`, `show log -r` (journal, plus récent d'abord). L'aide `?` et la touche <kbd>Tab</kbd> fonctionnent ; `help` en fin de commande donne une description.

## Sécurisation

```aoss
hostname SW-ACCES-B2
password manager user-name admin plaintext MotDePasseAdminTresLong
password operator user-name lecture plaintext MotDePasseLectureLong
crypto key generate ssh rsa bits 3072
ip ssh
ip ssh version 2
no telnet-server
no web-management plaintext
web-management ssl
crypto pki enroll-self-signed certificate-name web subject common-name SW-ACCES-B2
ip authorized-managers 10.0.99.0 255.255.255.0 access manager
timesync ntp
ntp unicast
ntp server 10.0.10.123
logging 10.0.98.20
snmpv3 enable
no snmp-server community public
```

RADIUS pour l'administration : `radius-server host 10.0.10.81 key CleRadiusTresLongue`, `aaa authentication ssh login radius local`.

## VLAN

```aoss
vlan 20
 name "UTILISATEURS"
 ! ports d'accès (le port quitte automatiquement le VLAN 1)
 untagged 1-44
 ! uplinks
 tagged 49-50
 ! (si le commutateur route)
 ip helper-address 10.0.10.67
 exit
vlan 30
 name "TELEPHONIE"
 tagged 1-44,49-50
 voice
 exit
vlan 99
 name "ADMINISTRATION"
 tagged 49-50
 ip address 10.0.99.12 255.255.255.0
 exit
ip default-gateway 10.0.99.1
!
show vlans
show vlans ports 10 detail
```

## Agrégation (« trunk » au sens Aruba)

```aoss
trunk 49-50 trk1 lacp
vlan 20 tagged trk1
vlan 30 tagged trk1
vlan 99 tagged trk1
show trunks
show lacp
```

Une fois dans l'agrégat, les ports sont référencés par `trk1` dans les VLAN.

## Spanning Tree

```aoss
spanning-tree
! défaut : MSTP
spanning-tree mode mstp
spanning-tree config-name "CAMPUS"
spanning-tree config-revision 1
spanning-tree instance 1 vlan 10 20 30
spanning-tree 1-44 admin-edge-port
spanning-tree 1-44 bpdu-protection
! multiplicateur : 1 × 4096 (cœur)
spanning-tree priority 1
show spanning-tree
```

## Empilement

| Technologie | Modèles | Principe |
| --- | --- | --- |
| **VSF** | 2930F, 5400R | Empilement par ports Ethernet (jusqu'à 8 membres sur 2930F) |
| Backplane stacking | 2930M, 3810M | Modules d'empilement dédiés |

```aoss
vsf member 1 link 1 1/49
vsf member 1 priority 255
vsf enable domain 1
show vsf
show vsf topology
```

## Routage

```aoss
ip routing
ip route 0.0.0.0 0.0.0.0 10.0.0.1
router ospf
 area backbone
 enable
vlan 10
 ip ospf area backbone
show ip route
```

## 802.1X et MAB

```aoss
radius-server host 10.0.10.81 key CleRadiusTresLongue
aaa authentication port-access eap-radius
aaa port-access authenticator 1-44
aaa port-access authenticator 1-44 client-limit 2
aaa port-access mac-based 1-44
aaa port-access authenticator active
```

Côté serveur RADIUS : [[01-freeradius/08-8021x-vlan-dynamique-mab|FreeRADIUS]], [[02-nps/02-8021x-vpn-equipements-depannage|NPS]], ou Aruba ClearPass.

## Sauvegarde et mise à jour

```aoss
copy running-config tftp 10.0.98.30 SW-ACCES-B2.cfg
! image dans la partition secondaire
copy sftp flash 10.0.98.30 WC_16_11_0021.swi secondary
boot system flash secondary
show flash
```

Deux partitions (*primary*/*secondary*) permettent un retour arrière en redémarrant sur l'ancienne image.

Suite : [[02-aos-cx-cli|AOS-CX]].

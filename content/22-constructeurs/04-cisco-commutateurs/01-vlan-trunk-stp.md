---
title: VLAN, trunks, Spanning Tree et EtherChannel
description: Commutateurs Cisco Catalyst (2960-X, 9200, 9300, 9500) — création des VLAN, ports d'accès et VLAN voix, trunks 802.1Q (VLAN autorisés, VLAN natif, désactivation de DTP), VTP en mode transparent ou off, Rapid PVST+ et MST (racine, PortFast, BPDU Guard, Root Guard), EtherChannel LACP, routage inter-VLAN par SVI sur commutateur de niveau 3, vérifications et équivalents graphiques.
tags: [cisco, catalyst, commutateur, vlan, trunk, spanning-tree, etherchannel, lacp, svi]
icon: network
---

Bases communes : [[02-cisco-ios-bases/01-cli-fondamentaux|CLI IOS / IOS XE]].

## VLAN

```cisco
vlan 10
 name SERVEURS
vlan 20
 name UTILISATEURS
vlan 30
 name TELEPHONIE
vlan 99
 name ADMINISTRATION
vlan 999
 ! VLAN inutilisé pour les ports désactivés
 name PARKING
!
show vlan brief
```

**VTP** : sur les réseaux modernes, désactiver la propagation automatique des VLAN (risque d'effacement de tous les VLAN par un commutateur ajouté avec un numéro de révision élevé) :

```cisco
! ou : vtp mode off
vtp mode transparent
```

## Ports d'accès

```cisco
interface range GigabitEthernet1/0/1 - 44
 description Postes utilisateurs
 switchport mode access
 switchport access vlan 20
 ! téléphone IP sur le même port (VLAN voix étiqueté)
 switchport voice vlan 30
 ! pas de DTP
 switchport nonegotiate
 spanning-tree portfast
 spanning-tree bpduguard enable
 no shutdown
!
interface range GigabitEthernet1/0/45 - 46
 description Ports inutilisés
 switchport mode access
 switchport access vlan 999
 shutdown
```

## Trunks

```cisco
interface TenGigabitEthernet1/1/1
 description Uplink vers SW-COEUR
 ! VLAN natif inutilisé (évite le saut de VLAN)
 switchport trunk native vlan 998
 switchport trunk allowed vlan 10,20,30,99
 switchport mode trunk
 switchport nonegotiate
!
! étiqueter aussi le VLAN natif (selon les plateformes)
vlan dot1q tag native
show interfaces trunk
```

Ajout d'un VLAN à un trunk existant : `switchport trunk allowed vlan **add** 40` — sans `add`, la liste est **remplacée** (erreur classique qui coupe tous les autres VLAN).

## Spanning Tree

```cisco
! ou : spanning-tree mode mst
spanning-tree mode rapid-pvst
spanning-tree extend system-id
! sur le commutateur de cœur (racine) ; 8192 sur le cœur secondaire
spanning-tree vlan 1-4094 priority 4096
! BPDU Guard sur tous les ports PortFast
spanning-tree portfast bpduguard default
spanning-tree loopguard default
!
interface TenGigabitEthernet1/1/3
 description Vers commutateur d'un prestataire
 ! empêche un équipement aval de devenir racine
 spanning-tree guard root
!
show spanning-tree summary
show spanning-tree vlan 20
show spanning-tree root
show spanning-tree inconsistentports
```

| Choix | Recommandation |
| --- | --- |
| Rapid PVST+ | Une instance par VLAN ; simple, propriétaire Cisco (interopère via le VLAN 1/CST) |
| **MST** (802.1s) | Instances regroupant des VLAN ; recommandé en environnement **multi-constructeurs** (même région : nom, révision, correspondance VLAN/instance identiques) |
| Racine | Placée explicitement sur le cœur ; jamais laissée au hasard |

```cisco MST
spanning-tree mode mst
spanning-tree mst configuration
 name CAMPUS
 revision 1
 instance 1 vlan 10,20,30
 instance 2 vlan 40-99
spanning-tree mst 0-2 priority 4096
```

## EtherChannel (LACP)

```cisco
interface range TenGigabitEthernet1/1/1 - 2
 description Agrégat vers SW-COEUR
 ! LACP actif
 channel-group 1 mode active
interface Port-channel1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30,99
 switchport nonegotiate
port-channel load-balance src-dst-mixed-ip-port
!
! drapeaux : P = dans l'agrégat, s = suspendu, D = down
show etherchannel summary
show lacp neighbor
```

Toujours configurer les mêmes paramètres (vitesse, mode, VLAN) sur tous les membres et les deux extrémités. Avec deux commutateurs de cœur, les agrégats multi-châssis demandent un empilement, **StackWise Virtual** (Catalyst 9500/9600) ou vPC (Nexus).

## Routage inter-VLAN (niveau 3)

```cisco
ip routing
interface Vlan10
 description Passerelle SERVEURS
 ip address 10.0.10.1 255.255.255.0
 no shutdown
interface Vlan20
 description Passerelle UTILISATEURS
 ip address 10.0.20.1 255.255.255.0
 ip helper-address 10.0.10.67
 no shutdown
!
interface Vlan99
 description Gestion du commutateur
 ip address 10.0.99.11 255.255.255.0
! commutateurs de niveau 2 sans ip routing
ip default-gateway 10.0.99.1
```

## En graphique

WebUI des Catalyst 9000 (`https://<ip>/webui`) : *Configuration → Layer2 → VLAN*, *Interface → Ethernet* (mode accès/trunk, VLAN), *Spanning Tree*, *EtherChannel* ; *Monitoring* pour l'état des ports et des voisins. Les Catalyst 1200/1300 et CBS se configurent principalement par l'interface web (*VLAN Management → Create VLAN / Port to VLAN*). Voir [[02-cisco-ios-bases/02-outils-graphiques-gestion|outils graphiques]].

Suite : [[02-securite-acces-8021x|sécurité d'accès et 802.1X]].

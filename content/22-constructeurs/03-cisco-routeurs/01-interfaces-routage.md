---
title: Interfaces et routage
description: Routeurs Cisco ISR et Catalyst 8000 (IOS XE) — interfaces physiques, sous-interfaces 802.1Q (router-on-a-stick), loopback, PPPoE pour l'accès Internet, routage statique et route flottante avec suivi IP SLA, OSPF (zones, interfaces passives, authentification), BGP (eBGP avec un opérateur, filtres préfixes, route-maps), redistribution, VRF-lite, vérification et équivalent dans la WebUI.
tags: [cisco, routeur, ios xe, ospf, bgp, ip sla, sous-interfaces, vrf]
icon: router
---

Bases communes (accès, sécurisation, sauvegarde) : [[02-cisco-ios-bases/01-cli-fondamentaux|CLI IOS / IOS XE]].

## Interfaces

```cisco
interface GigabitEthernet0/0/0
 description WAN - Opérateur A - lien 1 Gbit/s
 ip address 203.0.113.2 255.255.255.252
 no ip redirects
 no ip unreachables
 no ip proxy-arp
 negotiation auto
 no shutdown
!
! Router-on-a-stick : une sous-interface par VLAN sur le lien vers le commutateur
interface GigabitEthernet0/0/1
 description LAN - trunk vers SW-COEUR
 no ip address
 no shutdown
interface GigabitEthernet0/0/1.10
 description VLAN 10 - Serveurs
 encapsulation dot1Q 10
 ip address 10.0.10.1 255.255.255.0
interface GigabitEthernet0/0/1.20
 description VLAN 20 - Utilisateurs
 encapsulation dot1Q 20
 ip address 10.0.20.1 255.255.255.0
 ! relais DHCP
 ip helper-address 10.0.10.67
!
interface Loopback0
 description Identifiant du routeur, source des services de gestion
 ip address 10.255.0.1 255.255.255.255
```

### Accès Internet en PPPoE (fibre, VDSL)

```cisco
interface GigabitEthernet0/0/0
 no ip address
 pppoe enable group global
 pppoe-client dial-pool-number 1
 no shutdown
interface Dialer1
 mtu 1492
 ip address negotiated
 ip tcp adjust-mss 1452
 encapsulation ppp
 dialer pool 1
 ppp chap hostname identifiant@operateur
 ppp chap password 0 MotDePasseOperateur
 ip nat outside
ip route 0.0.0.0 0.0.0.0 Dialer1
```

(Certains opérateurs français imposent un VLAN sur le lien fibre : sous-interface `encapsulation dot1Q 835` par exemple, selon l'opérateur.)

## Routage statique et route flottante

```cisco
ip route 0.0.0.0 0.0.0.0 203.0.113.1 name INTERNET-PRINCIPAL track 1
! distance 250 : route de secours
ip route 0.0.0.0 0.0.0.0 198.51.100.1 250 name INTERNET-SECOURS
ip route 10.60.0.0 255.255.0.0 10.0.0.6 name SITE-LYON
!
! Suivi de la joignabilité réelle (pas seulement de l'état du lien)
ip sla 1
 icmp-echo 9.9.9.9 source-interface GigabitEthernet0/0/0
 frequency 10
ip sla schedule 1 life forever start-time now
track 1 ip sla 1 reachability
 delay down 10 up 30
```

## OSPF

```cisco
router ospf 1
 router-id 10.255.0.1
 ! 100 Gbit/s de référence (identique sur tous les routeurs)
 auto-cost reference-bandwidth 100000
 passive-interface default
 no passive-interface GigabitEthernet0/0/2
 network 10.0.0.0 0.0.0.3 area 0
 network 10.0.10.0 0.0.0.255 area 0
 network 10.255.0.1 0.0.0.0 area 0
 ! annonce la route par défaut si présente
 default-information originate
!
interface GigabitEthernet0/0/2
 ip ospf network point-to-point
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 CleOspfPartagee
 ip ospf hello-interval 1
 ip ospf dead-interval 4
```

Préférez l'authentification **HMAC-SHA** (`key chain` + `ip ospf authentication key-chain`) sur les versions récentes ; BFD (`bfd interval 300 min_rx 300 multiplier 3` + `ip ospf bfd`) accélère la détection des pannes.

## BGP avec un opérateur

```cisco
ip prefix-list PL-NOS-PREFIXES seq 5 permit 192.0.2.0/24
ip prefix-list PL-DEFAUT seq 5 permit 0.0.0.0/0
!
route-map RM-OPERATEUR-SORTIE permit 10
 match ip address prefix-list PL-NOS-PREFIXES
route-map RM-OPERATEUR-ENTREE permit 10
 match ip address prefix-list PL-DEFAUT
!
router bgp 64500
 bgp router-id 10.255.0.1
 bgp log-neighbor-changes
 neighbor 203.0.113.1 remote-as 3215
 neighbor 203.0.113.1 description Opérateur A
 neighbor 203.0.113.1 password CleSessionBgp
 address-family ipv4
  network 192.0.2.0 mask 255.255.255.0
  neighbor 203.0.113.1 activate
  neighbor 203.0.113.1 route-map RM-OPERATEUR-ENTREE in
  neighbor 203.0.113.1 route-map RM-OPERATEUR-SORTIE out
  neighbor 203.0.113.1 maximum-prefix 100 restart 5
 exit-address-family
! le préfixe doit exister dans la table pour être annoncé
ip route 192.0.2.0 255.255.255.0 Null0
```

> [!WARNING]
> Ne jamais établir une session eBGP sans **filtres en sortie** : annoncer par erreur des préfixes appris d'un opérateur à un autre crée une fuite de routes visible sur Internet.

## VRF-lite

```cisco
vrf definition INVITES
 address-family ipv4
interface GigabitEthernet0/0/1.90
 encapsulation dot1Q 90
 vrf forwarding INVITES
 ip address 10.0.90.1 255.255.255.0
ip route vrf INVITES 0.0.0.0 0.0.0.0 198.51.100.1
show ip route vrf INVITES
```

## Vérifications

```cisco
show ip interface brief
show ip route
! route utilisée pour une destination
show ip route 10.60.1.10
show ip ospf neighbor
show ip ospf interface brief
show ip bgp summary
show ip bgp neighbors 203.0.113.1 advertised-routes
show ip sla statistics
show track
ping 10.60.1.10 source Loopback0
traceroute 10.60.1.10 source Loopback0
```

## En graphique

WebUI (IOS XE) : *Configuration → Routing* (statique, OSPF, BGP, EIGRP) et *Monitoring → Routing* (tables, voisins). Pratique pour vérifier ; les configurations BGP avec route-maps restent plus claires en CLI. Voir [[02-cisco-ios-bases/02-outils-graphiques-gestion|outils graphiques]].

Suite : [[02-nat-dhcp-acl-vpn|NAT, DHCP, ACL et VPN]].

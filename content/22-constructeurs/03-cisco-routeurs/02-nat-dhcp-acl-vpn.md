---
title: NAT, DHCP, ACL et VPN
description: Services des routeurs Cisco IOS XE — NAT/PAT (surcharge, NAT statique et redirection de ports), serveur et relais DHCP, ACL standard et étendues nommées, pare-feu à zones (ZBFW), VPN IPsec site à site en IKEv2 (interface tunnel VTI), DMVPN en bref, vérifications et dépannage des tunnels.
tags: [cisco, routeur, nat, dhcp, acl, zbfw, ipsec, ikev2, vti]
icon: shield
---

## NAT / PAT

```cisco
interface GigabitEthernet0/0/0
 ip nat outside
interface GigabitEthernet0/0/1.20
 ip nat inside
!
ip access-list standard ACL-NAT-LAN
 permit 10.0.0.0 0.255.255.255
! PAT
ip nat inside source list ACL-NAT-LAN interface GigabitEthernet0/0/0 overload
!
! Publication d'un serveur (redirection de port)
ip nat inside source static tcp 10.0.10.25 443 203.0.113.2 443 extendable
! NAT statique 1:1
ip nat inside source static 10.0.10.30 203.0.113.5
!
show ip nat translations
show ip nat statistics
clear ip nat translation *
```

## DHCP

```cisco
ip dhcp excluded-address 10.0.20.1 10.0.20.49
ip dhcp pool VLAN20-UTILISATEURS
 network 10.0.20.0 255.255.255.0
 default-router 10.0.20.1
 dns-server 10.0.10.53 10.0.10.54
 domain-name corp.exemple.fr
 lease 1
 option 42 ip 10.0.10.123
!
! Relais vers un serveur DHCP central (sur la sous-interface du VLAN)
interface GigabitEthernet0/0/1.30
 ip helper-address 10.0.10.67
!
show ip dhcp binding
show ip dhcp conflict
```

Dans une entreprise, préférez un serveur DHCP central ([[03-dhcp-windows/01-presentation-installation|DHCP Windows]], [[02-kea/01-presentation-installation|Kea]]) avec relais sur les routeurs.

## ACL

```cisco
ip access-list extended ACL-DMZ-ENTREE
 remark Web public vers le serveur de la DMZ
 permit tcp any host 10.0.30.10 eq 443
 remark Administration depuis le réseau d'administration
 permit tcp 10.0.99.0 0.0.0.255 host 10.0.30.10 eq 22
 deny ip any any log
!
interface GigabitEthernet0/0/1.30
 ip access-group ACL-DMZ-ENTREE out
!
! compteurs de correspondances par ligne
show ip access-lists ACL-DMZ-ENTREE
```

| Point | Règle |
| --- | --- |
| Masques | **Masque générique** (*wildcard*) : `0.0.0.255` pour un /24 |
| Ordre | Première correspondance ; `deny ip any any` implicite en fin |
| Placement | ACL étendues près de la source ; sens `in`/`out` vu depuis l'interface |
| Modification | Numéros de séquence (`15 permit …`, `no 20`) dans les ACL nommées |

## Pare-feu à zones (ZBFW)

Pour un petit site, le routeur peut faire office de pare-feu à états :

```cisco
zone security INTERNE
zone security EXTERNE
class-map type inspect match-any CM-SORTIE
 match protocol tcp
 match protocol udp
 match protocol icmp
policy-map type inspect PM-INTERNE-VERS-EXTERNE
 class type inspect CM-SORTIE
  inspect
 class class-default
  drop log
zone-pair security ZP-IN-OUT source INTERNE destination EXTERNE
 service-policy type inspect PM-INTERNE-VERS-EXTERNE
interface GigabitEthernet0/0/1.20
 zone-member security INTERNE
interface GigabitEthernet0/0/0
 zone-member security EXTERNE
```

Le trafic **retour** est autorisé automatiquement (inspection à états) ; tout ce qui n'est pas autorisé entre deux zones est bloqué. Pour une sécurité périmétrique complète, un pare-feu dédié ([[05-cisco-asa/01-presentation-acces-interfaces|ASA/FTD]], [[15-fortigate/01-acces-cli-gui|FortiGate]]…) reste préférable.

## VPN IPsec site à site (IKEv2 + VTI)

```cisco
crypto ikev2 proposal PROP-AES256
 encryption aes-gcm-256
 prf sha384
 group 19 20
crypto ikev2 policy POL-IKEV2
 proposal PROP-AES256
crypto ikev2 keyring KR-LYON
 peer LYON
  address 198.51.100.20
  pre-shared-key local CleTresLongueEtAleatoireSiteParis
  pre-shared-key remote CleTresLongueEtAleatoireSiteLyon
crypto ikev2 profile IKEV2-LYON
 match identity remote address 198.51.100.20 255.255.255.255
 authentication remote pre-share
 authentication local pre-share
 keyring local KR-LYON
 dpd 10 3 periodic
crypto ipsec transform-set TS-GCM esp-gcm 256
 mode tunnel
crypto ipsec profile IPSEC-LYON
 set transform-set TS-GCM
 set ikev2-profile IKEV2-LYON
 set pfs group19
!
interface Tunnel10
 description VPN vers Lyon
 ip address 172.16.10.1 255.255.255.252
 ip mtu 1400
 ip tcp adjust-mss 1360
 tunnel source GigabitEthernet0/0/0
 tunnel mode ipsec ipv4
 tunnel destination 198.51.100.20
 tunnel protection ipsec profile IPSEC-LYON
!
! ou OSPF/BGP sur le tunnel
ip route 10.60.0.0 255.255.0.0 Tunnel10
```

L'interface **VTI** permet de router (et faire tourner un protocole dynamique) dans le tunnel, plus simple que les anciennes *crypto maps*. Pour de nombreux sites : **DMVPN** (tunnels dynamiques entre sites via un concentrateur, NHRP) ou SD-WAN. Pour l'interopérabilité avec un autre constructeur, alignez propositions IKE, PFS, durées de vie et sélecteurs (voir [[04-strongswan/03-site-a-site|strongSwan site à site]]).

```cisco
show crypto ikev2 sa detailed
! compteurs encaps/decaps
show crypto ipsec sa peer 198.51.100.20
show interface Tunnel10
! avec prudence, puis undebug all
debug crypto ikev2
```

| Symptôme | Cause probable |
| --- | --- |
| Pas de SA IKE | Pare-feu (UDP 500/4500), adresse du pair, identité, clé |
| SA IKE établie, pas de SA IPsec | Propositions ESP, PFS ou sélecteurs différents |
| SA établies mais trafic dans un seul sens (`decaps` à 0) | Route retour, NAT appliqué au trafic VPN (exclure le trafic du tunnel du NAT) |
| Coupures de grosses transferts | MTU/MSS (`ip tcp adjust-mss`) |

Suite : [[03-qos-haute-dispo-depannage|QoS, haute disponibilité et dépannage]].

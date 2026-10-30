---
title: Sécurité d'accès et 802.1X
description: Protéger l'accès au réseau sur les Catalyst — port-security, DHCP snooping, inspection ARP dynamique, IP Source Guard, contrôle des tempêtes, 802.1X et MAB avec RADIUS (configuration IOS XE en style classique et IBNS 2.0), VLAN dynamique et ACL téléchargeables, mode surveillance puis fermé, plan de contrôle, désactivation des services inutiles, vérifications.
tags: [cisco, catalyst, port-security, dhcp snooping, dai, 802.1x, mab, radius]
icon: shield-check
---

## Port-security

```cisco
interface GigabitEthernet1/0/10
 switchport mode access
 switchport port-security
 ! PC + téléphone
 switchport port-security maximum 2
 ! jette et journalise (shutdown : met le port en err-disabled)
 switchport port-security violation restrict
 switchport port-security aging time 60
 switchport port-security mac-address sticky
!
errdisable recovery cause psecure-violation
errdisable recovery interval 300
show port-security interface Gi1/0/10
```

Avec **802.1X**, port-security est généralement inutile (l'authentification contrôle l'accès).

## DHCP snooping, DAI, IP Source Guard

```cisco
ip dhcp snooping
ip dhcp snooping vlan 20,30
! si le serveur DHCP refuse l'option 82 insérée par le commutateur
no ip dhcp snooping information option
interface TenGigabitEthernet1/1/1
 ! uplink vers le relais/serveur DHCP
 ip dhcp snooping trust
interface range GigabitEthernet1/0/1 - 44
 ip dhcp snooping limit rate 15
!
! DAI : rejette les ARP falsifiés (usurpation de passerelle)
ip arp inspection vlan 20,30
interface TenGigabitEthernet1/1/1
 ip arp inspection trust
!
interface range GigabitEthernet1/0/1 - 44
 ! IP Source Guard : n'accepte que l'adresse attribuée par DHCP
 ip verify source
!
show ip dhcp snooping binding
show ip arp inspection statistics
```

Les équipements à **adresse fixe** dans un VLAN protégé par DAI nécessitent une entrée statique (`ip source binding` / ARP ACL).

## Contrôle des tempêtes

```cisco
interface range GigabitEthernet1/0/1 - 44
 storm-control broadcast level 1.00
 storm-control multicast level 5.00
 storm-control action trap
```

## 802.1X et MAB (IOS XE)

```cisco
aaa new-model
radius server NPS-01
 address ipv4 10.0.10.81 auth-port 1812 acct-port 1813
 key CleRadiusTresLongue
radius server NPS-02
 address ipv4 10.0.10.82 auth-port 1812 acct-port 1813
 key CleRadiusTresLongue
aaa group server radius GRP-RADIUS
 server name NPS-01
 server name NPS-02
 ip radius source-interface Vlan99
aaa authentication dot1x default group GRP-RADIUS
aaa authorization network default group GRP-RADIUS
aaa accounting dot1x default start-stop group GRP-RADIUS
aaa server radius dynamic-author
 client 10.0.10.81 server-key CleRadiusTresLongue
radius-server attribute 6 on-for-login-auth
radius-server attribute 8 include-in-access-req
radius-server attribute 25 access-request include
radius-server dead-criteria time 5 tries 3
radius-server deadtime 10
dot1x system-auth-control
!
interface GigabitEthernet1/0/10
 switchport mode access
 switchport access vlan 20
 switchport voice vlan 30
 ! un équipement de données + un téléphone
 authentication host-mode multi-domain
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 ! MODE SURVEILLANCE : accès accordé même en échec (phase de déploiement)
 authentication open
 authentication periodic
 authentication timer reauthenticate server
 authentication event server dead action authorize vlan 20
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 7
 spanning-tree portfast
```

| Phase | Configuration | Effet |
| --- | --- | --- |
| 1. **Surveillance** (*monitor mode*) | `authentication open` | Aucun blocage, journaux RADIUS pour inventorier les équipements |
| 2. Impact limité | ACL de port + `authentication open` | Accès restreint en cas d'échec |
| 3. **Fermé** | Sans `authentication open` | Accès uniquement après authentification |

Les nouvelles versions d'IOS XE proposent **IBNS 2.0** (`policy-map type control subscriber`, `access-session`) : conversion automatique avec `authentication display new-style`. Côté serveur RADIUS (VLAN dynamique, MAB, attributs) : [[01-freeradius/08-8021x-vlan-dynamique-mab|FreeRADIUS]], [[02-nps/02-8021x-vpn-equipements-depannage|NPS]], Cisco ISE.

```cisco
show access-session interface Gi1/0/10 details
show authentication sessions
test aaa group GRP-RADIUS utilisateur MotDePasse new-code
show aaa servers
```

## Plan de gestion

```cisco
no ip http server
no service pad
! ou désactivé seulement sur les ports utilisateurs : no cdp enable
no cdp run
! LLDP utile (téléphones, LLDP-MED) ; désactiver sur les ports exposés si nécessaire
lldp run
interface range GigabitEthernet1/0/1 - 44
 no cdp enable
! liaisons fibre unidirectionnelles
udld enable
```

## En graphique

WebUI : *Configuration → Security → AAA / 802.1X / Port Security / DHCP Snooping* ; à grande échelle, **Catalyst Center** et **Cisco ISE** pilotent les politiques d'accès (modèles, déploiement par étapes). Les petits commutateurs (Catalyst 1200/1300) proposent 802.1X, port-security et DHCP snooping dans leur interface web (*Security*).

Suite : [[03-stack-poe-depannage|empilement, PoE, mise à jour et dépannage]].

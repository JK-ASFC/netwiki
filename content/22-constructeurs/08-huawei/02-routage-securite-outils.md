---
title: Routage, sécurité, outils graphiques et dépannage
description: Routeurs NetEngine AR et pare-feu USG Huawei — NAT (Easy IP, NAT server), ACL avancées, VRRP, BGP, IPsec, zones de sécurité et politiques des pare-feu USG ; sécurité des ports (DHCP snooping, port-security, 802.1X/NAC), interface web des équipements, eSight et iMaster NCE (gestion, automatisation), commandes de diagnostic VRP et problèmes fréquents.
tags: [huawei, vrp, netengine, usg, nat, vrrp, esight, imaster nce]
icon: shield
---

## NAT sur routeur AR

```huawei
acl number 3000
 rule 5 permit ip source 10.0.0.0 0.255.255.255
#
interface GigabitEthernet0/0/0
 description WAN
 ip address 203.0.113.2 255.255.255.252
 # Easy IP : PAT sur l'adresse de l'interface
 nat outbound 3000
 # publication
 nat server protocol tcp global current-interface 443 inside 10.0.30.10 443
#
ip route-static 0.0.0.0 0.0.0.0 203.0.113.1
display nat session all
```

## VRRP

```huawei
interface Vlanif20
 ip address 10.0.20.2 255.255.255.0
 vrrp vrid 20 virtual-ip 10.0.20.1
 vrrp vrid 20 priority 120
 vrrp vrid 20 preempt-mode timer delay 60
 vrrp vrid 20 track interface GigabitEthernet0/0/0 reduced 30
display vrrp brief
```

## BGP

```huawei
bgp 64500
 router-id 10.255.0.1
 peer 203.0.113.1 as-number 3215
 peer 203.0.113.1 password cipher CleSessionBgp
 ipv4-family unicast
  network 192.0.2.0 255.255.255.0
  peer 203.0.113.1 ip-prefix PL-SORTIE export
  peer 203.0.113.1 route-limit 100
#
ip ip-prefix PL-SORTIE index 10 permit 192.0.2.0 24
display bgp peer
display bgp routing-table
```

## Pare-feu USG / HiSecEngine

Les pare-feu Huawei reposent sur des **zones de sécurité** (`trust`, `untrust`, `dmz`, `local`) et des **politiques de sécurité** :

```huawei
firewall zone trust
 add interface GigabitEthernet1/0/1
firewall zone untrust
 add interface GigabitEthernet1/0/0
#
security-policy
 rule name LAN-VERS-INTERNET
  source-zone trust
  destination-zone untrust
  source-address 10.0.0.0 8
  action permit
#
nat-policy
 rule name PAT-INTERNET
  source-zone trust
  destination-zone untrust
  source-address 10.0.0.0 8
  action source-nat easy-ip
display security-policy rule all
display firewall session table
```

Configuration courante par l'**interface web** du pare-feu (politiques, NAT, profils IPS/antivirus/filtrage d'URL, VPN IPsec et SSL).

## Sécurité d'accès (commutateurs)

```huawei
dhcp enable
dhcp snooping enable
vlan 20
 dhcp snooping enable
interface XGigabitEthernet0/0/1
 dhcp snooping trusted
#
interface GigabitEthernet0/0/10
 port-security enable
 port-security max-mac-num 2
 port-security protect-action restrict
#
# 802.1X : modèle « NAC unifié » (authentication-profile, dot1x-access-profile, radius-server template)
radius-server template RADIUS-NPS
 radius-server authentication 10.0.10.81 1812
 radius-server shared-key cipher CleRadiusTresLongue
```

## Outils graphiques

| Outil | Usage |
| --- | --- |
| **Interface web** (*Web NMS*) | Commutateurs S, routeurs AR et pare-feu : assistant, VLAN, ports, NAT, politiques ; `http secure-server enable` |
| **eSight** | Plateforme de gestion historique (découverte, topologie, supervision, configuration, sauvegardes) |
| **iMaster NCE** (Campus, WAN, Fabric) | Contrôleur SDN : provisionnement, automatisation, analyse (CampusInsight) |
| CloudCampus / Huawei Cloud | Gestion cloud pour PME |

> [!NOTE]
> Selon les pays et secteurs, l'utilisation d'équipements Huawei dans certaines infrastructures est soumise à des **restrictions réglementaires** (opérateurs de télécommunications, infrastructures critiques). Vérifiez le cadre applicable à votre organisation.

## Dépannage

| Besoin | Commande |
| --- | --- |
| Informations de diagnostic | `display diagnostic-information` (ou à enregistrer dans un fichier pour le support) |
| Journaux | `display logbuffer`, `display trapbuffer` |
| CPU / mémoire | `display cpu-usage`, `display memory-usage` |
| Interfaces | `display interface brief`, `display interface XGigabitEthernet0/0/1` |
| Optiques | `display transceiver interface XGigabitEthernet0/0/1 verbose` |
| MAC / ARP | `display mac-address`, `display arp` |
| Voisins | `display lldp neighbor brief` |
| Test | `ping -a 10.255.0.1 10.60.1.10`, `tracert -a 10.255.0.1 10.60.1.10` |

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Modifications sans effet (VRP 8) | `commit` oublié | `commit`, `display configuration candidate` |
| Port sans trafic vers un autre constructeur | Type hybrid par défaut, VLAN non autorisés | `port link-type trunk`, `allow-pass` |
| SSH refusé | `service-type` ou `ssh user` manquants, ACL VTY | Vérifier AAA et `user-interface vty` |
| Perte de configuration | `save` oublié | `save` après validation |

Comparaison avec les autres CLI : [[01-correspondance-commandes/01-administration-commutation|correspondance des commandes]].

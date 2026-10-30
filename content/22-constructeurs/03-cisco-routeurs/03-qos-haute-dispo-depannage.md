---
title: QoS, haute disponibilité, supervision et dépannage
description: Exploiter les routeurs Cisco — QoS (classification, marquage DSCP, file prioritaire pour la voix, mise en forme sur un lien opérateur), redondance de passerelle HSRP et VRRP, SNMPv3, NetFlow/IPFIX, journaux, Embedded Event Manager, capture embarquée (EPC), commandes de dépannage et problèmes fréquents.
tags: [cisco, routeur, qos, hsrp, vrrp, snmpv3, netflow, dépannage]
icon: bug
---

## QoS sur un lien WAN

```cisco
class-map match-any CM-VOIX
 match dscp ef
class-map match-any CM-SIGNALISATION
 match dscp cs3 af31
class-map match-any CM-METIER
 match dscp af21
!
policy-map PM-WAN-ENFANT
 class CM-VOIX
  ! file prioritaire (LLQ), limitée
  priority percent 20
 class CM-SIGNALISATION
  bandwidth percent 5
 class CM-METIER
  bandwidth percent 30
 class class-default
  fair-queue
!
! Le débit contractuel est souvent inférieur à la vitesse physique : mise en forme pour que la file se forme sur le routeur
policy-map PM-WAN-PARENT
 class class-default
  ! 95 Mbit/s pour un accès à 100 Mbit/s
  shape average 95000000
  service-policy PM-WAN-ENFANT
interface GigabitEthernet0/0/0
 service-policy output PM-WAN-PARENT
!
show policy-map interface GigabitEthernet0/0/0 output
```

Le marquage DSCP est fait au plus près de la source (téléphones, commutateurs d'accès) et vérifié en entrée (confiance limitée aux équipements connus).

## Redondance de passerelle

```cisco
! HSRP (Cisco) — routeur principal
interface GigabitEthernet0/0/1.20
 ip address 10.0.20.2 255.255.255.0
 standby version 2
 standby 20 ip 10.0.20.1
 standby 20 priority 110
 standby 20 preempt delay minimum 60
 standby 20 authentication md5 key-string CleHsrp
 ! si le lien Internet tombe, laisser la main au second routeur
 standby 20 track 1 decrement 20
!
! VRRP (standard, interopérable avec d'autres constructeurs) — IOS XE
interface GigabitEthernet0/0/1.30
 ip address 10.0.30.2 255.255.255.0
 vrrp 30 address-family ipv4
  address 10.0.30.1 primary
  priority 110
  preempt delay minimum 60
!
show standby brief
show vrrp brief
```

## Supervision

```cisco
! SNMPv3 (authentification et chiffrement) en lecture seule
ip access-list standard ACL-SNMP
 permit 10.0.98.10
 permit 10.0.98.11
snmp-server view VUE-LECTURE iso included
snmp-server group GRP-SUPERVISION v3 priv read VUE-LECTURE access ACL-SNMP
snmp-server user supervision GRP-SUPERVISION v3 auth sha MotDePasseAuthLong priv aes 128 MotDePassePrivLong
snmp-server location Paris - Salle B - Baie 4
snmp-server contact exploitation@corp.exemple.fr
snmp-server enable traps
snmp-server host 10.0.98.10 version 3 priv supervision
!
! NetFlow / IPFIX (Flexible NetFlow) vers un collecteur
flow exporter EXP-COLLECTEUR
 destination 10.0.98.50
 transport udp 2055
 export-protocol ipfix
flow monitor MON-WAN
 record netflow ipv4 original-input
 exporter EXP-COLLECTEUR
interface GigabitEthernet0/0/0
 ip flow monitor MON-WAN input
 ip flow monitor MON-WAN output
```

Collecte côté supervision : [[04-zabbix/01-presentation-installation|Zabbix]], [[01-centreon/01-presentation|Centreon]], [[09-telegraf/01-presentation-configuration|Telegraf (SNMP, gNMI)]].

## Automatisation embarquée : EEM

```cisco
event manager applet ALERTE-WAN
 event syslog pattern "Line protocol on Interface GigabitEthernet0/0/0, changed state to down"
 action 1.0 syslog priority critical msg "Lien WAN principal perdu"
 action 2.0 cli command "enable"
 action 3.0 cli command "show ip route 0.0.0.0 | append flash:eem-wan.log"
```

## Capture embarquée (EPC)

```cisco
monitor capture CAP interface GigabitEthernet0/0/0 both match ipv4 host 198.51.100.20 any limit duration 120
monitor capture CAP start
monitor capture CAP stop
show monitor capture CAP buffer brief
monitor capture CAP export flash:cap-wan.pcap
```

Analyse du fichier dans [[02-reseau-diagnostic/02-wireshark-analyse|Wireshark]].

## Commandes de dépannage

| Besoin | Commande |
| --- | --- |
| Erreurs d'interface | `show interfaces Gi0/0/0` (CRC, *input errors*, *output drops*), `show controllers` |
| Charge | `show processes cpu sorted`, `show processes cpu history`, `show platform resources` |
| Mémoire | `show memory statistics`, `show platform software status control-processor brief` |
| Table de routage, CEF | `show ip route x.x.x.x`, `show ip cef x.x.x.x detail` |
| ARP | `show ip arp`, `clear arp-cache` |
| Journaux | `show logging \| include %LINK\|%OSPF\|%BGP` |
| Traçage de paquet (IOS XE) | `debug platform condition ipv4 10.0.20.15/32 both` + `debug platform packet-trace packet 128` + `show platform packet-trace summary` |
| Collecte pour le TAC | `show tech-support \| redirect flash:tech.txt` |

> [!WARNING]
> Les commandes `debug` peuvent saturer le processeur d'un routeur en production : les limiter (conditions, ACL), les lancer depuis une session SSH avec `terminal monitor`, et toujours prévoir `undebug all`.

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Interface `up/down` | Câble, autre extrémité, encapsulation, keepalive | Vérifier l'autre extrémité, `show interfaces` |
| Duplex mismatch (collisions tardives, CRC) | Négociation forcée d'un seul côté | Auto des deux côtés |
| Voisin OSPF bloqué en `EXSTART` | MTU différente | Aligner la MTU (ou `ip ospf mtu-ignore` en dernier recours) |
| BGP en `Active` / `Idle` | TCP 179 filtré, adresse, AS, mot de passe | `show ip bgp neighbors`, ACL, `debug ip bgp` |
| Internet coupé, LAN OK | NAT (`ip nat inside/outside`), route par défaut, DNS | `show ip nat translations`, `show ip route 0.0.0.0` |
| Lenteur des transferts dans le VPN | Fragmentation | `ip tcp adjust-mss`, MTU du tunnel |

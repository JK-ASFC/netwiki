---
title: Objets, NAT et règles d'accès
description: Configurer la politique d'un Cisco ASA — objets et groupes d'objets réseau et service, NAT d'objet (auto NAT) et NAT manuel (twice NAT), PAT pour Internet, publication de serveurs, exemption de NAT pour le VPN, listes d'accès étendues appliquées aux interfaces ou globales, politique d'inspection (Modular Policy Framework), équivalents dans ASDM et vérification avec packet-tracer.
tags: [cisco, asa, nat, acl, objets, packet-tracer, asdm, pare-feu]
icon: shield
---

## Objets

```asa
object network OBJ-LAN
 subnet 10.0.0.0 255.0.0.0
object network OBJ-SRV-WEB
 host 10.0.30.10
object network OBJ-SRV-WEB-PUBLIC
 host 203.0.113.5
object-group network GRP-ADMINS
 network-object 10.0.99.0 255.255.255.0
 network-object host 10.0.98.10
object-group service SVC-WEB tcp
 port-object eq https
 port-object eq www
```

## NAT

Depuis ASA 8.3, la NAT se configure **par objet** (*auto NAT*) ou en règles **manuelles** (*twice NAT*), et les ACL référencent les adresses **réelles** (non traduites).

| Section (ordre de traitement) | Usage |
| --- | --- |
| 1. NAT manuel (avant) | Exemptions (VPN), cas particuliers |
| 2. **Auto NAT** (dans les objets) | PAT Internet, publications de serveurs |
| 3. NAT manuel `after-auto` | Règles générales de repli |

```asa
! PAT : tout le LAN sort avec l'adresse de l'interface outside
object network OBJ-LAN
 nat (inside,outside) dynamic interface
!
! Publication d'un serveur web (NAT statique avec ports)
object network OBJ-SRV-WEB
 nat (dmz,outside) static OBJ-SRV-WEB-PUBLIC service tcp https https
!
! Exemption de NAT pour le trafic VPN vers Lyon (identité, sans proxy ARP)
object network OBJ-LYON
 subnet 10.60.0.0 255.255.0.0
nat (inside,outside) source static OBJ-LAN OBJ-LAN destination static OBJ-LYON OBJ-LYON no-proxy-arp route-lookup
!
show nat detail
show xlate
```

## Règles d'accès

```asa
access-list ACL-OUTSIDE-IN extended permit tcp any object OBJ-SRV-WEB eq https
access-list ACL-OUTSIDE-IN extended deny ip any any log
access-group ACL-OUTSIDE-IN in interface outside
!
access-list ACL-INSIDE-IN extended permit tcp object-group GRP-ADMINS any object-group SVC-WEB
access-list ACL-INSIDE-IN extended permit udp object OBJ-LAN host 10.0.10.53 eq domain
access-list ACL-INSIDE-IN extended permit ip object OBJ-LAN any
access-group ACL-INSIDE-IN in interface inside
!
! Règles globales (toutes interfaces) possibles : access-group ACL-GLOBALE global
! compteurs (hitcnt) par ligne
show access-list ACL-OUTSIDE-IN
```

> [!NOTE]
> L'ACL entrante sur `outside` autorise la destination **réelle** (`10.0.30.10`), pas l'adresse publique : la NAT a déjà été « défaite » quand l'ACL est évaluée.

## Inspection applicative

La politique par défaut (`policy-map global_policy`) inspecte DNS, FTP, SIP, ICMP… (gestion des ports dynamiques). Ajouter l'inspection ICMP pour que les réponses aux pings traversent :

```asa
policy-map global_policy
 class inspection_default
  inspect icmp
  inspect icmp error
```

Désactiver les inspections qui posent problème (ex. `inspect sip` avec certains opérateurs SIP) plutôt que d'ouvrir largement.

## Vérifier : packet-tracer

```asa
packet-tracer input outside tcp 198.51.100.77 54321 203.0.113.5 443 detailed
packet-tracer input inside tcp 10.0.20.15 50000 8.8.8.8 443
```

Le résultat liste chaque étape (routage, NAT, ACL, inspection, VPN) et la **décision finale** (ALLOW/DROP avec la règle responsable) : l'outil de dépannage le plus utile de l'ASA. ASDM propose le même outil graphiquement (*Tools → Packet Tracer*).

## Dans ASDM

| Menu ASDM | Équivalent CLI |
| --- | --- |
| *Configuration → Firewall → Objects* | `object`, `object-group` |
| *Configuration → Firewall → Access Rules* | `access-list` + `access-group` |
| *Configuration → Firewall → NAT Rules* | `nat` (sections 1, 2, 3 affichées dans l'ordre) |
| *Configuration → Firewall → Service Policy Rules* | `policy-map`, `class-map` |
| *Monitoring → Logging → Real-Time Log Viewer* | `show logging` / syslog |

ASDM peut afficher les commandes CLI qu'il va envoyer (*Preview CLI commands before sending*) : utile pour apprendre et pour la traçabilité des changements.

Suite : [[03-vpn-failover-depannage|VPN, haute disponibilité et dépannage]].

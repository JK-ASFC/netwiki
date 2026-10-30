---
title: Cisco CME — téléphonie sur routeur IOS (et Packet Tracer)
description: Configurer Cisco Unified Communications Manager Express (CME) sur un routeur ISR — prérequis réseau (VLAN voix, DHCP option 150, PoE), telephony-service, ephone-dn et ephone (SCCP), postes SIP (voice register), plan de numérotation, dial-peers vers un trunk SIP, transfert et renvoi, groupes de recherche, messagerie, commandes show et debug, et maquette complète réalisable dans Cisco Packet Tracer.
tags: [cisco, cme, telephony-service, ephone, dial-peer, packet tracer, sccp, sip]
icon: phone-forwarded
---

**Cisco Unified CME** (*Communications Manager Express*) est un IPBX intégré à l'IOS des routeurs ISR (licence *UCK9*/*Collaboration*). Il convient aux petits sites (jusqu'à quelques centaines de postes) et c'est l'exemple de téléphonie IP classique des formations Cisco, réalisable dans **Packet Tracer** (routeur 2811, commutateur 2960/3560, téléphones IP 7960). Pour les grands déploiements, Cisco utilise [[02-cucm-administration|CUCM]].

## Prérequis réseau

```cisco
! Commutateur d'accès : VLAN données 10, VLAN voix 20
vlan 10
 name DONNEES
vlan 20
 name VOIX
interface range FastEthernet0/1 - 20
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 20
 spanning-tree portfast
 mls qos trust cos
interface GigabitEthernet0/1
 switchport mode trunk
```

```cisco
! Routeur CME : sous-interfaces, DHCP avec option 150 (serveur TFTP = CME)
interface FastEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
interface FastEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
ip dhcp excluded-address 192.168.20.1 192.168.20.9
ip dhcp pool VOIX
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 option 150 ip 192.168.20.1
```

L'**option DHCP 150** indique aux téléphones Cisco le serveur TFTP où récupérer leur configuration et leur micrologiciel.

## telephony-service (postes SCCP)

```cisco
telephony-service
 max-ephones 20
 max-dn 40
 ip source-address 192.168.20.1 port 2000
 auto assign 1 to 20
 create cnf-files
 date-format dd-mm-yy
 system message NetWiki CME
!
ephone-dn 1
 number 1001
 name Alice Martin
ephone-dn 2
 number 1002
 name Bruno Petit
!
ephone 1
 mac-address 0001.4364.A101
 type 7960
 button 1:1
ephone 2
 mac-address 0001.4364.A102
 type 7960
 button 1:2
```

| Commande | Rôle |
| --- | --- |
| `max-ephones` / `max-dn` | Nombre maximal de postes / de numéros (limité par la licence et le modèle) |
| `ip source-address … port 2000` | Adresse où les postes SCCP s'enregistrent |
| `auto assign 1 to 20` | Affecter automatiquement les `ephone-dn` 1 à 20 aux postes qui s'enregistrent (pratique en maquette) |
| `create cnf-files` | Générer les fichiers de configuration TFTP des postes |
| `ephone-dn` | Une **ligne** (numéro) |
| `ephone` + `button 1:1` | Un **poste physique** (adresse MAC) et l'affectation de la ligne 1 au bouton 1 |

Dans **Packet Tracer**, alimentez les téléphones (adaptateur secteur ou commutateur PoE), branchez-les sur un port avec `switchport voice vlan` : ils obtiennent une adresse, s'enregistrent et affichent leur numéro ; un double-clic sur le poste ouvre son interface pour composer un numéro.

## Postes SIP (voice register)

```cisco
voice service voip
 allow-connections sip to sip
 sip
  registrar server expires max 1200 min 300
!
voice register global
 mode cme
 source-address 192.168.20.1 port 5060
 max-dn 20
 max-pool 20
 create profile
!
voice register dn 1
 number 1101
 name Chloe Durand
voice register pool 1
 id mac 0011.2233.4455
 number 1 dn 1
 username 1101 password Lw8cT5yQ2nVb7Rp
 codec g711alaw
```

## Trunk SIP et dial-peers

```cisco
! Sortie : 0 + numéro national vers l'opérateur (ou un CUBE / SBC)
dial-peer voice 100 voip
 description Sortie nationale
 destination-pattern 0[1-79]........
 session protocol sipv2
 session target ipv4:198.51.100.20
 dtmf-relay rtp-nte
 codec g711alaw
 no vad
!
dial-peer voice 112 voip
 description Urgences
 destination-pattern 1[578]
 session protocol sipv2
 session target ipv4:198.51.100.20
 codec g711alaw
!
! Entrée : numéros reçus de l'opérateur
dial-peer voice 200 voip
 description Entrant operateur
 incoming called-number 012345....
 session protocol sipv2
 codec g711alaw
!
! Traduction : SDA 0123456701 vers le poste 1001
voice translation-rule 1
 rule 1 /^0123456701$/ /1001/
voice translation-profile SDA
 translate called 1
dial-peer voice 200 voip
 translation-profile incoming SDA
```

Dans un `destination-pattern`, `.` vaut un chiffre quelconque, `T` une longueur variable (fin par délai), `[1-79]` un ensemble.

## Fonctions usuelles

```cisco
! Transfert et renvoi
telephony-service
 transfer-system full-consult
 transfer-pattern .T
!
ephone-dn 1
 call-forward busy 1999
 call-forward noan 1999 timeout 20
!
! Groupe de recherche (hunt group)
voice hunt-group 1 parallel
 pilot 1500
 list 1001,1002
 timeout 20
!
! Interception de groupe
ephone-dn 1
 pickup-group 10
ephone-dn 2
 pickup-group 10
```

## Vérification et débogage

| Commande | Usage |
| --- | --- |
| `show ephone` / `show ephone registered` | Postes SCCP et état d'enregistrement |
| `show ephone-dn summary` | Lignes et état (IDLE, RINGING, CONNECTED) |
| `show voice register all` / `show voice register pool all` | Postes SIP |
| `show telephony-service` | Paramètres CME |
| `show dial-peer voice summary` | Dial-peers |
| `show call active voice brief` | Appels en cours |
| `show voip rtp connections` | Flux RTP |
| `show ip dhcp binding` | Adresses distribuées aux téléphones |
| `test voice translation-rule 1 0123456701` | Tester une règle de traduction |
| `debug ephone register` | Enregistrement des postes SCCP |
| `debug ccsip messages` | Messages SIP |
| `debug voip dialpeer` | Choix du dial-peer |
| `undebug all` | Arrêter tous les débogages |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Téléphone bloqué sur « Configuring IP » | Pas de DHCP dans le VLAN voix, pas d'alimentation PoE | Pool DHCP, `switchport voice vlan`, PoE |
| « Registering » en boucle | Option 150 absente, `ip source-address` erroné, `create cnf-files` oublié | Corriger, puis `reset all` dans `telephony-service` |
| Poste enregistré sans numéro | Aucun `ephone-dn` affecté (`button`, `auto assign`) | `show ephone`, affecter la ligne |
| Appels sortants impossibles | Aucun dial-peer correspondant, codec | `debug voip dialpeer`, aligner les codecs |

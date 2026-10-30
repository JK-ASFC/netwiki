---
title: Empilement, PoE, miroir de ports et dépannage
description: Exploiter les commutateurs Catalyst — StackWise (rôles, priorités, renumérotation, remplacement d'un membre), StackWise Virtual, PoE (budget, priorités, 802.3bt), SPAN/RSPAN/ERSPAN, LLDP et CDP pour la cartographie, QoS d'accès (confiance et marquage voix), mises à jour, commandes de diagnostic (ports err-disabled, erreurs, MAC, boucles) et problèmes fréquents.
tags: [cisco, catalyst, stackwise, poe, span, lldp, err-disabled, dépannage]
icon: bug
---

## Empilement StackWise

Plusieurs Catalyst (9200, 9300, 3850…) reliés par des câbles d'empilement forment **un seul commutateur logique** (une IP de gestion, une configuration, interfaces `Gi1/0/x`, `Gi2/0/x`…).

```cisco
! membres, rôle (Active/Standby/Member), priorité, état
show switch
show switch stack-ports summary
! le membre 1 devient le commutateur actif préféré
switch 1 priority 15
switch 2 priority 14
! renuméroter un membre (redémarrage du membre)
switch 3 renumber 2
! pré-provisionner un membre (configuration prête avant son arrivée)
switch 3 provision C9300-48P
```

| Opération | Procédure |
| --- | --- |
| Ajout d'un membre | Même version d'IOS XE (ou mise à jour automatique `software auto-upgrade enable`), câblage en anneau, pré-provisionnement |
| Remplacement d'un membre en panne | Nouveau commutateur du même modèle, même numéro : il reprend la configuration des ports |
| Câblage | **Anneau** complet (redondance) ; StackPower pour mutualiser les alimentations (9300) |

**StackWise Virtual** (Catalyst 9500/9600) : deux commutateurs de cœur forment un châssis virtuel via des liens Ethernet dédiés, avec agrégats multi-châssis vers l'accès (sans Spanning Tree bloquant).

## PoE

```cisco
! budget disponible / consommé, par port
show power inline
show power inline Gi1/0/10 detail
interface GigabitEthernet1/0/10
 ! limiter à 30 W
 power inline auto max 30000
 ! servi en premier si le budget manque (téléphones, AP)
 power inline port priority high
interface GigabitEthernet1/0/40
 ! pas de PoE (port PC)
 power inline never
```

Dimensionner le **budget** PoE (alimentations) pour les points d'accès Wi-Fi 6/7 (802.3at/bt, 30 à 60 W) et caméras ; `power inline police` coupe un équipement qui dépasse sa classe.

## Miroir de ports

```cisco
! SPAN local
monitor session 1 source interface Gi1/0/10 both
monitor session 1 destination interface Gi1/0/48
! ERSPAN (IOS XE) : vers un analyseur distant encapsulé dans GRE
monitor session 2 type erspan-source
 source interface Gi1/0/10 both
 destination
  erspan-id 10
  ip address 10.0.98.60
  origin ip address 10.0.99.11
show monitor session all
```

Analyse : [[02-reseau-diagnostic/01-wireshark-capture|Wireshark]].

## Cartographie : LLDP et CDP

```cisco
lldp run
! voisin, port, adresse de gestion, capacités (téléphone, AP)
show lldp neighbors detail
show cdp neighbors detail
! sur quel port est une machine
show mac address-table address 0050.56aa.bb01
show mac address-table interface Gi1/0/10
! (L3) correspondance IP → MAC
show ip arp 10.0.20.57
```

Remonter de proche en proche (MAC → port → voisin LLDP) permet de localiser un équipement ; les outils d'inventaire ([[06-support-parc/05-glpi-inventaire-assistance|GLPI]], NetBox, Lansweeper) automatisent cette cartographie.

## QoS d'accès (voix)

```cisco
! Catalyst 9000 : faire confiance au marquage seulement si un téléphone Cisco est détecté (CDP)
interface GigabitEthernet1/0/10
 trust device cisco-phone
 ! génère une politique QoS standard (à relire)
 auto qos voip cisco-phone
show auto qos
show policy-map interface Gi1/0/10
```

## Mises à jour

Mode install sur IOS XE (voir [[02-cisco-ios-bases/01-cli-fondamentaux|fondamentaux]]) : tous les membres de l'empilement sont mis à jour par `install add file … activate commit` ; prévoir l'interruption (redémarrage) ou l'ISSU (mise à jour sans coupure) sur les plateformes qui la permettent (StackWise Virtual, 9400/9600 avec superviseurs redondants).

## Commandes de diagnostic

| Besoin | Commande |
| --- | --- |
| État des ports | `show interfaces status`, `show interfaces status err-disabled` |
| Cause d'un err-disabled | `show errdisable recovery`, journaux (`%PM-4-ERR_DISABLE`) |
| Erreurs physiques | `show interfaces Gi1/0/10 counters errors`, `show interfaces transceiver detail` (puissance optique) |
| Câble cuivre | `test cable-diagnostics tdr interface Gi1/0/10` puis `show cable-diagnostics tdr interface Gi1/0/10` |
| Boucle / tempête | Pics de CPU, `show spanning-tree detail \| include ieee\|occurr\|from`, MAC qui « bagotent » (`%SW_MATM-4-MACFLAP_NOTIF`) |
| Table MAC | `show mac address-table count`, `show mac address-table dynamic vlan 20` |
| Ressources matérielles | `show platform hardware fed switch active fwd-asic resource tcam utilization` |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Port `err-disabled (bpduguard)` | Commutateur ou boucle branchés sur un port d'accès | Retirer l'équipement, `shutdown` / `no shutdown` |
| Port `err-disabled (psecure-violation)` | Trop d'adresses MAC | Vérifier l'équipement, ajuster le maximum |
| Téléphone sans VLAN voix | LLDP/CDP désactivé, voice vlan absent | `switchport voice vlan`, LLDP-MED, option DHCP |
| Pas d'adresse DHCP avec snooping | Uplink non `trust`, option 82 refusée | `ip dhcp snooping trust`, `no ip dhcp snooping information option` |
| EtherChannel `(s)` suspendu | Configuration différente sur un membre ou côté opposé | Aligner les membres, `show etherchannel detail` |
| VLAN absent sur un trunk | `allowed vlan` remplacé sans `add` | Corriger la liste |
| Membre de pile en `V-Mismatch` | Version différente | Mise à jour automatique ou manuelle du membre |

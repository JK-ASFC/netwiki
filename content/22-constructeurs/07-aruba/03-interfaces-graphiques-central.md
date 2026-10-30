---
title: Interfaces graphiques, NetEdit, Central et dépannage
description: Gestion graphique des commutateurs Aruba — interface web d'ArubaOS-Switch et d'AOS-CX, Aruba Instant On (petits sites), NetEdit (gestion de configurations AOS-CX avec validation et conformité), HPE Aruba Networking Central (cloud : modèles, groupes, surveillance, mises à jour), AirWave et IMC historiques, ClearPass pour le contrôle d'accès, commandes de dépannage des deux systèmes et problèmes fréquents.
tags: [aruba, central, netedit, interface web, instant on, clearpass, dépannage]
icon: monitor
---

## Interfaces web intégrées

| Système | Accès | Possibilités |
| --- | --- | --- |
| **ArubaOS-Switch** | `https://<ip>` (après `web-management ssl`) | Statut, ports, VLAN (cases *tagged/untagged*), PoE, journaux, mise à jour ; limité pour les fonctions avancées |
| **AOS-CX** | `https://<ip>` (VRF de gestion, `https-server vrf mgmt`) | Tableau de bord, interfaces, VLAN, LAG, journaux, **analyse NAE**, sauvegarde/restauration, mise à jour |

## Aruba Instant On

Gamme pour TPE/PME (commutateurs 1830, 1930, 1960 et points d'accès), gérée par l'**application mobile** ou le **portail cloud Instant On** (sans licence), ou en mode local par interface web. Simple, mais sans CLI complète ni fonctions avancées.

## NetEdit (AOS-CX)

**NetEdit** (logiciel installé localement, VM) gère les configurations d'un parc AOS-CX :

- recherche et édition **multi-équipements** (modifier un VLAN sur 50 commutateurs en une fois) ;
- **validation** avant déploiement (syntaxe, cohérence), plans de changements ;
- **conformité** : règles vérifiant que les configurations respectent les standards (SNMPv3, NTP, bannière…) ;
- historique et comparaison des configurations.

## HPE Aruba Networking Central

**Central** (cloud, abonnement par équipement) est la plateforme de gestion unifiée d'Aruba (Wi-Fi, commutateurs AOS-S et AOS-CX, passerelles SD-WAN) :

| Fonction | Description |
| --- | --- |
| **Groupes** et **modèles** | Configuration par groupe (interface graphique « UI config » ou modèles texte avec variables par équipement) |
| Provisionnement sans intervention (ZTP) | Un commutateur neuf contacte Central (Activate) et reçoit sa configuration |
| Surveillance | Santé des clients, des équipements, topologie, alertes |
| Mises à jour | Planifiées par groupe |
| NAC (Central NAC / ClearPass) | Contrôle d'accès, rôles, segmentation dynamique |

En gestion par Central, éviter les modifications locales en CLI (écrasées par la configuration du groupe).

## Outils historiques et contrôle d'accès

| Outil | Statut |
| --- | --- |
| **AirWave** | Gestion historique Wi-Fi et filaire sur site (fin de vie) |
| HPE IMC | Gestion historique des parcs ProCurve/Comware (voir [[06-hpe-comware/02-interface-web-imc\|IMC]]) |
| **ClearPass Policy Manager** | Serveur RADIUS/NAC d'Aruba : 802.1X, MAB, profilage, invités, intégration MDM |

## Dépannage

| Besoin | ArubaOS-Switch | AOS-CX |
| --- | --- | --- |
| Ports | `show interfaces brief`, `show interfaces 10` | `show interface brief`, `show interface 1/1/10` |
| Erreurs | `show interfaces 10` (*FCS*, *drops*) | `show interface 1/1/10 extended` |
| VLAN | `show vlans ports 10 detail` | `show vlan port 1/1/10` |
| MAC | `show mac-address 0050.56aa.bb01` | `show mac-address-table address 00:50:56:aa:bb:01` |
| Voisins | `show lldp info remote-device` | `show lldp neighbor-info` |
| Journal | `show logging -r` | `show logging -r` |
| Câble | `test cable-diagnostics 10` | `diagnostics` puis `diag cable-diagnostic 1/1/10` |
| Optiques | `show interfaces transceiver detail` | `show interface 1/1/49 transceiver detail` |
| Support | `show tech` | `show tech` / `copy support-files` |
| 802.1X | `show port-access authenticator` | `show port-access clients detail` |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| (AOS-S) Port retiré d'un VLAN de manière inattendue | `untagged` dans un nouveau VLAN retire le port de l'ancien VLAN non étiqueté | Vérifier `show vlans ports … detail` |
| (AOS-S) Agrégat avec Cisco non formé | `trunk … trunk` statique d'un côté, LACP de l'autre | `trunk 49-50 trk1 lacp` |
| (AOS-CX) SSH injoignable sur le port de gestion | Service non activé dans la VRF `mgmt` | `ssh server vrf mgmt` |
| (AOS-CX) VSX incohérent | Configuration non synchronisée | `show vsx config-consistency`, `vsx-sync` |
| Configuration écrasée | Commutateur géré par Central (groupe) | Modifier dans Central ou détacher l'équipement du groupe |

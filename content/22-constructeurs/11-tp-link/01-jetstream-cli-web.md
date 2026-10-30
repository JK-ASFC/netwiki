---
title: Commutateurs JetStream — interface web et CLI
description: Commutateurs TP-Link JetStream / Omada (TL-SG2xxx, SG3xxx, SX3xxx) en mode autonome — accès initial (192.168.0.1 ou DHCP), interface web (VLAN 802.1Q, ports, LAG, STP, sécurité, 802.1X), CLI de style Cisco (enable, configure, interface gigabitEthernet 1/0/1, switchport), sécurisation, sauvegarde, mise à jour, passage en gestion Omada, dépannage.
tags: [tp-link, jetstream, commutateur, cli, interface web, vlan, omada]
icon: network
---

Les commutateurs **TP-Link JetStream** (désormais intégrés à la gamme **Omada** : SG2xxx « smart », SG3xxx/SX3xxx « L2+ / L3 ») sont très répandus dans les PME. Ils se gèrent soit **individuellement** (interface web et CLI), soit de façon centralisée par le **contrôleur Omada** ([[02-omada-controleur|Omada]]).

## Accès initial

| Élément | Valeur courante |
| --- | --- |
| Adresse IP | DHCP ; sinon **192.168.0.1/24** par défaut |
| Identifiant | `admin` / `admin`, changement imposé au premier accès |
| Console | RJ45 et/ou micro-USB sur les modèles L2+/L3, **38400 bauds** sur de nombreux modèles (à vérifier : 9600 ou 115200 selon les séries) |
| Utilitaire | **Omada Discovery Utility** pour trouver les équipements et les adopter |

## Interface web

| Menu | Usage |
| --- | --- |
| *System* | Informations, IP de gestion (VLAN de gestion), comptes, heure (NTP) |
| **L2 Features → 802.1Q VLAN** | Création des VLAN, ports *Tagged/Untagged*, **PVID** par port |
| L2 Features → LAG | Agrégats statiques ou LACP |
| L2 Features → Spanning Tree | STP/RSTP/MSTP, ports *Edge*, BPDU Protect |
| QoS → Voice VLAN / LLDP-MED | Téléphonie |
| Security | ACL, Port Security, DHCP Snooping, ARP Inspection, **802.1X** avec RADIUS |
| Maintenance | Mise à jour, sauvegarde/restauration, redémarrage, diagnostics de câble |

Sur les modèles récents, *Save Config* (icône en haut) est nécessaire pour que les changements survivent au redémarrage.

## CLI

Les modèles L2+/L3 disposent d'une CLI **de style Cisco** (Telnet/SSH/console) :

```tplink
enable
configure
hostname SW-ACCES-B2
vlan 20
 name UTILISATEURS
 exit
interface range gigabitEthernet 1/0/1-24
 switchport general allowed vlan 20 untagged
 switchport pvid 20
 spanning-tree common-config portfast enable
 exit
interface gigabitEthernet 1/0/25
 switchport general allowed vlan 10,20,30,99 tagged
 exit
interface vlan 99
 ip address 10.0.99.14 255.255.255.0
 exit
ip route 0.0.0.0 0.0.0.0 10.0.99.1
user name admin privilege admin secret MotDePasseAdminTresLong
ip ssh server
no telnet enable
end
copy running-config startup-config
show vlan brief
show interface status
```

Les mots-clés exacts (`switchport general allowed vlan … untagged`, `switchport mode trunk` sur certains modèles) varient selon la génération : consultez le guide CLI du modèle ; l'interface web reste la référence la plus simple sur ces équipements.

## Sécurisation

- [ ] Mot de passe administrateur fort, comptes séparés lecture/écriture
- [ ] HTTPS et SSH uniquement ; HTTP et Telnet désactivés
- [ ] **Gestion restreinte** : VLAN de gestion dédié, *Access Security* (adresses autorisées)
- [ ] SNMPv3, journaux vers syslog
- [ ] Micrologiciel à jour (vérifier le numéro de **version matérielle** `V1/V2/V3…` avant de télécharger : une image prévue pour une autre version matérielle peut rendre l'équipement inutilisable)

## Passage en gestion Omada

Un commutateur adopté par un contrôleur Omada voit sa configuration **pilotée** par le contrôleur (l'interface web locale passe en lecture seule ou est désactivée). Pour revenir en mode autonome : *Forget* dans le contrôleur puis réinitialisation de l'équipement.

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Équipement introuvable | IP 192.168.0.1 ou DHCP inconnu | Omada Discovery Utility, poste en 192.168.0.x |
| Port dans le mauvais VLAN | PVID non modifié (reste 1) | Régler l'*untagged* **et** le PVID |
| Paramètres perdus | *Save Config* non effectué | Enregistrer |
| Interface locale en lecture seule | Commutateur géré par Omada | Modifier dans le contrôleur |

---
title: Commutateurs Netgear — web, CLI et Insight
description: Commutateurs Netgear pour PME et AV (gammes Smart GS/GC, M4250/M4300/M4350 « Fully Managed », Insight) — accès initial et outil de découverte, interface web (VLAN, LAG, STP, PoE, QoS, ACL), CLI de style Cisco des gammes M4xxx (enable, configure, vlan database, interface), particularités AV over IP (profils IGMP, M4250), gestion cloud Insight, sécurisation, sauvegarde et dépannage.
tags: [netgear, commutateur, m4300, m4250, insight, cli, interface web]
icon: network
---

**Netgear** est très présent dans les PME et dans l'**audiovisuel sur IP** (gamme M4250/M4350 avec profils prêts pour Dante, NDI, AES67, SDVoE). Trois modes de gestion coexistent : interface web locale, **CLI** (gammes « Fully Managed » M4xxx) et cloud **Insight**.

## Accès initial

| Élément | Valeur courante |
| --- | --- |
| Adresse | DHCP ; à défaut **192.168.0.239** sur de nombreux modèles |
| Identifiant | `admin` / `password` (anciens modèles) ou mot de passe imposé au premier accès |
| Outil | **NETGEAR Switch Discovery Tool** (Windows/macOS) pour trouver les commutateurs |
| Console | RJ45/USB sur les M4xxx (115200 bauds) |

## Interface web

| Menu | Usage |
| --- | --- |
| *System* | IP de gestion, comptes, heure, SNMP, journaux |
| **Switching → VLAN** | Création des VLAN, ports *Tagged*/*Untagged*, **PVID** |
| Switching → LAG | Agrégats statiques ou LACP |
| Switching → STP | RSTP/MSTP, ports *Edge* |
| Switching → Multicast | **IGMP snooping**, querier (indispensable pour l'AV sur IP et la diffusion) |
| QoS, Security | Files, DSCP, ACL, 802.1X, Port Security |
| Maintenance | Sauvegarde/restauration, mise à jour (deux images), redémarrage |

Les M4250/M4350 proposent une interface dédiée **AV UI** avec **profils** (Dante, NDI, AVB…) qui configurent en un clic VLAN, QoS et multidiffusion.

## CLI (gammes M4xxx)

```netgear
enable
configure
hostname "SW-AV-01"
vlan database
vlan 20
vlan name 20 "UTILISATEURS"
exit
interface 1/0/10
vlan pvid 20
vlan participation include 20
vlan participation exclude 1
exit
interface 1/0/49
vlan participation include 10,20,30,99
vlan tagging 10,20,30,99
exit
interface vlan 99
ip address 10.0.99.15 255.255.255.0
exit
ip default-gateway 10.0.99.1
set igmp
interface 1/0/1-1/0/48
set igmp
exit
ip ssh server enable
no ip telnet server enable
exit
write memory
show vlan brief
show interfaces status all
```

La logique des VLAN est proche de celle de [[07-aruba/01-aos-switch-cli|ArubaOS-Switch]] (participation et étiquetage par VLAN) avec une syntaxe inspirée de Cisco ; le guide CLI du modèle détaille les variantes.

## Insight

**Netgear Insight** (application mobile et portail cloud, abonnement) gère les commutateurs, points d'accès et routeurs compatibles Insight : déploiement par organisations et lieux, profils réseau, surveillance et mises à jour. Un équipement en mode Insight n'est plus configurable localement de la même façon.

## Sécurisation et dépannage

- [ ] Mot de passe administrateur fort, HTTPS et SSH, HTTP/Telnet désactivés
- [ ] VLAN de gestion dédié, accès restreint par adresses
- [ ] SNMPv3, micrologiciel à jour (vérifier les avis de sécurité Netgear)

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Flux multicast qui saturent le réseau (AV) | IGMP snooping ou querier absent | Activer IGMP snooping et un querier par VLAN |
| Port dans le mauvais VLAN | PVID ou participation incorrects | `vlan pvid`, `vlan participation include/exclude` |
| Commutateur introuvable | IP par défaut 192.168.0.239, DHCP | Outil de découverte |
| Configuration perdue | `write memory` / *Save* oublié | Enregistrer |

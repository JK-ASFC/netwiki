---
title: Outils graphiques et de gestion Cisco
description: Administrer les équipements Cisco en mode graphique — WebUI d'IOS XE (assistants Day 0, tableau de bord, configuration, dépannage), interfaces web des petits commutateurs (Catalyst 1000/1200/1300, CBS), outils historiques (Cisco Configuration Professional, Network Assistant), Cisco Catalyst Center (ex-DNA Center), Catalyst SD-WAN Manager, Cisco Meraki, Packet Tracer et CML pour la formation et les laboratoires, Smart Licensing et comptes Cisco.
tags: [cisco, webui, catalyst center, dna center, packet tracer, cml, smart licensing, gestion]
icon: monitor
---

## WebUI d'IOS XE

Les routeurs (ISR 1000/4000, Catalyst 8000) et commutateurs Catalyst 9000 sous **IOS XE** intègrent une **interface web** :

```cisco
ip http secure-server
! ou aaa
ip http authentication local
! (selon la version, suites modernes par défaut)
ip http secure-ciphersuite aes-128-cbc-sha
! HTTP en clair désactivé
no ip http server
! restreindre au réseau d'administration
ip http access-class ipv4 ACL-ADMIN
username admin privilege 15 algorithm-type scrypt secret MotDePasseAdminTresLong
```

Accès : `https://<adresse>/webui`.

| Menu | Usage |
| --- | --- |
| **Day 0 Wizard** | Première configuration (nom, adresses, compte, VLAN) sur un équipement neuf |
| Dashboard | État des interfaces, CPU, mémoire, voisins |
| Configuration | Interfaces, VLAN, routage, ACL, AAA, services (assistants) |
| Administration | Mises à jour logicielles, sauvegarde, licences, gestion des utilisateurs |
| **Troubleshooting** | Ping/traceroute, capture de paquets (EPC), journaux, *debug bundle* |

L'interface web convient aux opérations ponctuelles ; la CLI reste la référence pour l'exploitation et l'automatisation.

## Petits commutateurs (Catalyst 1000/1200/1300, CBS)

Les gammes d'entrée de gamme (Catalyst 1000, **Catalyst 1200/1300**, anciennes **Cisco Business** CBS 220/250/350, SG/SF) se configurent principalement par leur **interface web** (assistant de démarrage, VLAN, ports, PoE, Smartport). Les modèles « managés » (1300, CBS350) disposent aussi d'une CLI proche d'IOS mais non identique (`show running-config`, `configure`, `interface gi1/0/1`) ; les modèles « smart » sont essentiellement graphiques. **Cisco Business Dashboard** gérait les gammes CBS (produit en fin de vie, vérifier le support).

## Outils historiques

| Outil | Statut | Usage |
| --- | --- | --- |
| Cisco Configuration Professional (CCP) | Fin de vie | Configuration graphique des routeurs ISR G2 (Java) |
| Cisco Network Assistant (CNA) | Fin de vie | Gestion de petits parcs de commutateurs Catalyst anciens |
| Cisco Prime Infrastructure | Fin de vie | Gestion de parc, remplacé par Catalyst Center |

Ces outils peuvent encore se rencontrer sur des parcs anciens ; ne pas les déployer sur de nouveaux équipements.

## Cisco Catalyst Center (ex-DNA Center)

**Catalyst Center** est la plateforme de gestion des réseaux de campus Cisco (appliance matérielle ou virtuelle) :

| Fonction | Description |
| --- | --- |
| Découverte et inventaire | Équipements, topologie, versions |
| **Gestion des images** (SWIM) | Versions dorées, mise à jour planifiée des parcs |
| Modèles et provisionnement | Configuration par modèles (*templates*), PnP (*Plug and Play*) des équipements neufs |
| **Assurance** | Santé du réseau et des clients, analyse des problèmes (Wi-Fi, DHCP, authentification) |
| SD-Access | Fabric de campus (LISP/VXLAN) avec Cisco ISE |
| API | Intégration (ITSM, automatisation) |

Cisco ISE (contrôle d'accès 802.1X/NAC) est souvent déployé avec Catalyst Center ; voir le principe dans [[01-freeradius/08-8021x-vlan-dynamique-mab|802.1X]].

## Catalyst SD-WAN Manager

Pour le SD-WAN Cisco (ex-Viptela) : **SD-WAN Manager** (vManage) pilote les routeurs en mode contrôleur (*controller mode*), avec modèles, politiques centralisées et surveillance. En mode contrôleur, la configuration locale en CLI est limitée : tout passe par le gestionnaire.

## Cisco Meraki

Gamme entièrement gérée par le **tableau de bord cloud** : voir [[26-cisco-meraki/01-tableau-de-bord-configuration|Cisco Meraki]]. Certains commutateurs Catalyst 9000 peuvent aussi être gérés par le tableau de bord Meraki.

## Formation et laboratoires

| Outil | Usage |
| --- | --- |
| **Packet Tracer** | Simulateur gratuit (compte Cisco Networking Academy) : idéal pour apprendre la CLI, pas un émulateur complet |
| **Cisco Modeling Labs** (CML) | Émulation de vraies images (IOS XE, IOS XR, NX-OS, ASA) ; édition gratuite limitée en nœuds |
| EVE-NG, GNS3 | Émulateurs tiers avec images Cisco sous licence ([[13-vmware-workstation/01-installation-utilisation\|laboratoires]]) |
| Cisco DevNet Sandbox | Environnements de test en ligne pour les API |

## Licences et comptes

- **Smart Licensing Using Policy** (IOS XE 17.3.2+) : les licences sont associées à un **Smart Account** ; l'équipement envoie des rapports d'utilisation (directement, via un **CSLU** local ou un satellite SSM On-Prem pour les réseaux isolés).
- Compte **Cisco.com** lié au contrat de support (SmartNet) pour télécharger les images et ouvrir des dossiers au TAC.

```cisco
show license summary
show license status
license smart transport cslu
license smart url cslu http://10.0.98.40:8182/cslu/v1/pi
```

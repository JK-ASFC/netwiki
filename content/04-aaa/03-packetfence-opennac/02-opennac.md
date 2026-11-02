---
title: OpenNAC
description: OpenNAC (Open Cloud Factory) — contrôle d'accès réseau open source et OpenNAC Enterprise, architecture (ON Core, ON Analytics, ON Sensor, ON Captive Portal), 802.1X et MAB, politiques selon l'identité et la posture, découverte et inventaire des terminaux, intégration Active Directory et équipements multi-constructeurs, déploiement en appliances virtuelles et comparaison avec PacketFence.
tags: [opennac, nac, 802.1x, contrôle d'accès, visibilité réseau]
icon: shield-check
---

**OpenNAC** (Open Cloud Factory, Espagne) est une solution de **contrôle d'accès réseau** dont le cœur est open source, déclinée en **OpenNAC Enterprise** (support, modules avancés). Elle met l'accent sur la **visibilité** (inventaire des terminaux, flux) et les politiques fondées sur l'identité, le type d'équipement et la posture.

| Composant | Rôle |
| --- | --- |
| **ON Core** | Moteur de politiques, RADIUS (802.1X, MAB), base des terminaux, interface d'administration |
| ON Analytics | Collecte et visualisation (journaux, tableaux de bord, alertes) |
| ON Sensor | Sonde de visibilité réseau (analyse passive du trafic) |
| ON Captive Portal | Portail d'enregistrement invités/BYOD |

## Déploiement

Appliances virtuelles fournies par l'éditeur (OVA pour VMware et Proxmox, images pour les clouds) : un ou plusieurs *Core* (haute disponibilité), *Analytics* et *Sensors* selon la taille. Configuration réseau initiale en console, puis interface web d'administration.

Étapes communes à tout NAC :

1. Source d'identité : **Active Directory** (LDAP, Kerberos) ;
2. Déclaration des **équipements réseau** (commutateurs, contrôleurs Wi-Fi) avec secret RADIUS et, si besoin, SNMP/CoA ;
3. **Politiques** : conditions (groupe AD, type d'équipement, posture, lieu) → actions (VLAN, ACL, rôle, isolation, portail) ;
4. Mode **surveillance** (*monitor*) d'abord : observer les décisions sans bloquer, puis passage en mode bloquant port par port.

## Choisir entre OpenNAC et PacketFence

| Critère | [[01-packetfence\|PacketFence]] | OpenNAC |
| --- | --- | --- |
| Communauté, documentation | Large, documentation publique détaillée | Plus restreinte, orientée offre Enterprise |
| Portail captif, BYOD | Très complet | Oui |
| Visibilité / sondes | Fingerbank, Suricata | ON Sensor, ON Analytics |
| Installation | ZEN (OVA) ou paquets Debian/RHEL | Appliances de l'éditeur |

Pour un premier projet NAC en environnement libre, PacketFence offre la documentation et la communauté les plus fournies.

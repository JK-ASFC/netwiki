---
title: Interface web, IMC et dépannage
description: Gérer les commutateurs HPE Comware en graphique — interface web intégrée (assistant, VLAN, ports, IRF, journaux), HPE Intelligent Management Center (IMC) pour la découverte, la topologie, les sauvegardes et les déploiements de configuration, gestion par Aruba Central selon les modèles, commandes de diagnostic Comware (display diagnostic-information, journaux, transceivers, boucles) et problèmes fréquents.
tags: [hpe, comware, interface web, imc, dépannage, diagnostic, commutateur]
icon: monitor
---

## Interface web

Les commutateurs Comware intègrent une interface web (HTTP/HTTPS) :

```comware
ip https enable
undo ip http enable
local-user admin class manage
 service-type https ssh
```

Accès : `https://<ip-de-gestion>` avec un compte local ayant le service `https`.

| Menu (selon le modèle) | Usage |
| --- | --- |
| *Dashboard* / *Device* | État du système, CPU, mémoire, ventilation, journaux |
| **Network → VLAN** | Création des VLAN, affectation des ports (untagged/tagged) |
| Network → Interfaces | Vitesse, duplex, PoE, agrégation |
| Network → IRF | État de l'empilement |
| Security | 802.1X, ACL, utilisateurs |
| System → Maintenance | Mise à jour, sauvegarde/restauration de la configuration, redémarrage |

L'interface web convient aux petits sites ; pour un parc, utilisez la CLI scriptée ou un outil de gestion.

## HPE Intelligent Management Center (IMC)

**IMC** est la plateforme de gestion réseau historique d'HPE (Windows ou Linux), très répandue sur les parcs Comware et ProCurve :

| Module | Fonction |
| --- | --- |
| Découverte et **topologie** | Carte du réseau (LLDP), inventaire des équipements |
| Supervision | Disponibilité, interfaces, performances, alarmes (traps SNMP, syslog) |
| **Gestion des configurations** | Sauvegarde planifiée, comparaison, déploiement de configurations ou de fragments à plusieurs équipements |
| Gestion des micrologiciels | Mises à jour planifiées |
| Modules optionnels | UAM (802.1X/NAC), VAN, gestion du Wi-Fi |

Prérequis côté commutateurs : **SNMPv3** et identifiants SSH/Telnet configurés dans IMC. IMC n'évolue plus beaucoup : pour les nouveaux projets HPE/Aruba, **HPE Aruba Networking Central** (cloud) prend le relais ; certains modèles Comware récents peuvent y être gérés.

## Commandes de diagnostic

| Besoin | Commande |
| --- | --- |
| Synthèse de diagnostic (support) | `display diagnostic-information` (écrite dans un fichier pour le support HPE) |
| Journaux | `display logbuffer`, `display logbuffer reverse` |
| CPU / mémoire | `display cpu-usage`, `display memory` |
| Interfaces | `display interface brief`, `display interface GigabitEthernet1/0/10`, `display counters rate inbound interface` |
| Optiques | `display transceiver interface Ten-GigabitEthernet1/0/49 verbose`, `display transceiver diagnosis interface …` |
| MAC / ARP | `display mac-address 0050-56aa-bb01`, `display arp \| include 10.0.20.57` |
| Voisins | `display lldp neighbor-information list` |
| Boucles | `display stp abnormal-port`, journaux de changements de topologie ; `loopback-detection enable` |
| Ressources de routage | `display ip routing-table statistics` |

```comware
# Détection de boucle par port (utile en accès)
loopback-detection global enable vlan all
interface GigabitEthernet1/0/10
 loopback-detection action shutdown
```

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Configuration perdue après redémarrage | `save` oublié | `save force` après chaque changement validé |
| VLAN absent d'un lien vers un autre constructeur | `port trunk permit vlan` incomplet, VLAN 1 retiré d'un côté seulement | Aligner les VLAN autorisés et le PVID (VLAN natif) |
| Agrégat LACP non formé avec un Cisco | Mode statique d'un côté, dynamique de l'autre | `link-aggregation mode dynamic` + LACP actif côté Cisco |
| IRF scindé, deux maîtres | Liens IRF coupés, pas de MAD | Rétablir les liens, configurer MAD (BFD/LACP) |
| Accès SSH refusé | `service-type ssh` absent, rôle utilisateur | `local-user … service-type ssh`, `authorization-attribute user-role network-admin` |
| Téléphones sans VLAN voix | Voice VLAN / LLDP-MED non configurés | Activer LLDP, `voice-vlan`, option DHCP ou LLDP-MED |

Comparaison avec les autres CLI : [[01-correspondance-commandes/01-administration-commutation|correspondance des commandes]].

---
title: Présentation, installation et utilisation
description: Security Onion (Security Onion Solutions, libre) — plate-forme de supervision de sécurité et de chasse aux menaces : composants (Suricata, Zeek, Stenographer/pcap complet, Elastic Agent et Fleet, Elasticsearch, Kibana, SOC Console, Detections, cas), architectures (évaluation, autonome, distribuée avec manager, nœuds de recherche et capteurs), prérequis matériels et cartes de capture (port miroir, TAP), installation depuis l'ISO, so-allow pour l'accès, intégration des journaux Windows et syslog, chasse (Hunt), PCAP, gestion des alertes et mises à jour (soup).
tags: [security onion, soc, nsm, suricata, zeek, chasse aux menaces, pcap]
icon: info
---

**Security Onion** assemble en une distribution ce qu'un SOC met des mois à intégrer : détection réseau par signatures ([[05-suricata/01-presentation-installation|Suricata]]) et métadonnées ([[07-zeek/01-presentation-installation|Zeek]]), **capture complète des paquets**, collecte des journaux d'hôtes (Elastic Agent), stockage et recherche, console d'analyse (alertes, chasse, cas, PCAP).

| Rôle | Fonction |
| --- | --- |
| **Manager** | Console SOC, configuration, coordination |
| **Search node** | Stockage et recherche (Elasticsearch) |
| **Sensor** | Capture sur port miroir/TAP : Suricata, Zeek, pcap |
| Standalone / Eval | Tout sur une machine (petit site, laboratoire) |

## Installation

1. Matériel : pour un autonome de production, 16 à 24 cœurs, 64 Go+ de RAM, disques rapides et volumineux (pcap), **deux interfaces** : gestion + capture (sans adresse IP, reliée au port miroir).
2. Démarrer sur l'**ISO Security Onion** (base Oracle Linux), installer, puis suivre l'assistant `so-setup` : type de nœud, interface de gestion, interface de capture, réseau domestique (HOME_NET), compte administrateur.
3. Autoriser l'accès à la console depuis le poste d'analyse :

```bash
sudo so-allow                 # choisir « analyst » et l'adresse ou le réseau autorisé
sudo so-status                # état des conteneurs et services
```

Console : `https://<manager>/`. Mises à jour : `sudo soup`.

## Utilisation

- **Alerts** : alertes Suricata et règles de détection regroupées, escalade vers un **cas**.
- **Hunt** : requêtes sur toutes les données (connexions Zeek, DNS, HTTP, journaux d'hôtes), pivots.
- **PCAP** : récupérer les paquets d'une connexion pour analyse dans Wireshark.
- **Detections** : gérer règles Suricata, Sigma et YARA.
- Postes Windows/Linux : déployer l'**Elastic Agent** depuis Fleet (paquets générés par la console) ; équipements : syslog.

Interface : [[02-interface-graphique|console SOC]] · commandes : [[90-aide-memoire|aide-mémoire]].

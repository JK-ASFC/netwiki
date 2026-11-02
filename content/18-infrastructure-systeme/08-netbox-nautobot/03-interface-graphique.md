---
title: Interface graphique
description: Interfaces web de NetBox et Nautobot — tableau de bord, navigation par menus (Organisation, DCIM, IPAM, Circuits, Virtualisation), hiérarchie de préfixes et utilisation, élévation des baies, fiche d'équipement (interfaces, câbles, adresses), traçage de câble, import CSV, journaux des modifications, jetons d'API ; spécificités Nautobot (Jobs, dépôts Git, Golden Config).
tags: [netbox, nautobot, interface graphique, ipam, dcim]
icon: app-window
---

## NetBox

| Vue | Usage |
| --- | --- |
| **Tableau de bord** | Widgets configurables (statistiques d'objets, journal des modifications, favoris) |
| **IPAM → Préfixes** | Arborescence, utilisation (%), **adresses disponibles**, VLAN associé |
| **DCIM → Baies** | **Élévation** (vue avant/arrière avec les équipements), réservations d'emplacements |
| **Fiche d'équipement** | Interfaces, adresses IP, **câbles** (bouton *Trace* : chemin complet de bout en bout), consoles, alimentation |
| Listes | Filtres, export CSV/YAML, **import en masse**, modification groupée |
| Profil | **Jetons d'API**, préférences |
| Administration | Utilisateurs, groupes, permissions par objet, journal des modifications |

<!-- CAPTURE: NetBox — liste des préfixes avec leur utilisation | _assets/netbox-prefixes.png -->
<!-- CAPTURE: NetBox — élévation d'une baie | _assets/netbox-elevation-baie.png -->
<!-- CAPTURE: NetBox — fiche d'équipement et traçage de câble | _assets/netbox-trace-cable.png -->

## Nautobot

Interface très proche de NetBox, avec en plus :

- **Jobs** : liste, formulaire de lancement, résultats et journaux ;
- **Extensibility → Git repositories** : dépôts synchronisés (Jobs, modèles, contextes de configuration) ;
- menus des **applications** (Golden Config : tableau de conformité par équipement et par fonctionnalité).

<!-- CAPTURE: Nautobot — lancement d'un Job | _assets/nautobot-job.png -->
<!-- CAPTURE: Nautobot — Golden Config, tableau de conformité | _assets/nautobot-golden-config.png -->

## Correspondance interface ↔ API

| Action | Interface | API |
| --- | --- | --- |
| Prochaine IP libre | Préfixe → *Available IPs* | `POST /api/ipam/prefixes/<id>/available-ips/` |
| Lister les équipements d'un site | DCIM → Devices (filtre site) | `GET /api/dcim/devices/?site=paris-dc1` |
| Import | Import CSV | `POST` en lot sur la liste |

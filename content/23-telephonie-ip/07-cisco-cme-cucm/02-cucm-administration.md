---
title: Cisco CUCM — Unified Communications Manager
description: Cisco Unified Communications Manager (CUCM) — architecture en cluster (publisher, subscribers, TFTP), interfaces d'administration web (CM Administration, Serviceability, OS Administration, Disaster Recovery), configuration (device pools, régions, partitions et CSS, route patterns, SIP trunks, utilisateurs et téléphones, BAT), CLI de la plateforme (show status, utils dbreplication, file get), Webex Calling et CUBE, supervision RTMT et dépannage.
tags: [cisco, cucm, collaboration, css, partitions, rtmt, sip trunk, cube]
icon: phone-forwarded
---

**CUCM** est l'IPBX d'entreprise de Cisco, déployé en **cluster** de machines virtuelles (appliances VMware) pour des milliers à des dizaines de milliers de postes, avec les applications associées : messagerie **Unity Connection**, présence **IM and Presence**, centre de contacts (UCCX), passerelles et **CUBE** (Cisco Unified Border Element, le SBC de Cisco sur IOS XE). Cisco pousse aussi la téléphonie cloud **Webex Calling**.

## Architecture du cluster

| Nœud | Rôle |
| --- | --- |
| **Publisher** | Base de données de référence (Informix), toutes les modifications s'y font |
| **Subscribers** | Copies de la base, traitement des appels (*Call Manager service*), TFTP |
| Groupes CUCM | Ordre de bascule des postes entre serveurs (primaire, secondaire) |

## Interfaces web

| Interface | URL / accès | Usage |
| --- | --- | --- |
| **Cisco Unified CM Administration** | `https://<cucm>/ccmadmin` | Configuration téléphonique |
| **Cisco Unified Serviceability** | `https://<cucm>/ccmservice` | Services, traces, alarmes |
| **OS Administration** | `https://<cucm>/cmplatform` | Réseau, certificats, versions, NTP |
| **Disaster Recovery System** | `https://<cucm>/drf` | Sauvegardes et restaurations |
| **RTMT** (*Real-Time Monitoring Tool*) | Client Windows/Mac à télécharger depuis CM Administration | Supervision temps réel, alertes, collecte de traces |
| Self Care Portal | `https://<cucm>/ucmuser` | Libre-service des utilisateurs (renvois, numéros) |

## Logique de configuration

| Objet | Rôle |
| --- | --- |
| **Device Pool** | Paramètres communs d'un site : groupe CUCM, région, date/heure, localisation |
| **Region** | Codecs autorisés entre sites (ex. G.711 dans le site, G.729 entre sites) |
| **Location** / CAC | Contrôle d'admission (bande passante WAN) |
| **Partition** | Ensemble de numéros (ex. `PT_INTERNE`, `PT_NATIONAL`, `PT_INTERNATIONAL`) |
| **Calling Search Space** (CSS) | Liste ordonnée de partitions qu'un poste a le droit d'appeler : c'est la **classe de service** |
| **Route Pattern** | Motif de numéros sortants (`0.[1-79]XXXXXXXX`) → Route List → Route Group → passerelles/trunks |
| **Translation Pattern** | Transformation de numéros (SDA → numéro interne) |
| **SIP Trunk** | Liaison vers CUBE, un autre cluster, Unity Connection, un opérateur |
| **Hunt Pilot / Line Group** | Groupes de recherche |
| **End User** / **Phone** / **Directory Number** | Utilisateur (souvent synchronisé depuis l'AD), téléphone (MAC, modèle, bouton), ligne |

Pour les opérations en masse, **BAT** (*Bulk Administration Tool*) importe des fichiers CSV (téléphones, utilisateurs, lignes) ; l'**API AXL** (SOAP) permet l'automatisation.

## CLI de la plateforme

En SSH (compte administrateur de la plateforme), CUCM propose une CLI limitée (pas de shell Linux) :

```text
admin:show status
admin:show version active
admin:show network eth0 detail
admin:utils service list
admin:utils service restart Cisco CallManager
admin:utils dbreplication runtimestate
admin:utils ntp status
admin:show risdb query phone
admin:file list activelog cm/trace/ccm/sdl
admin:file get activelog cm/trace/ccm/sdl/SDL001_100_000001.txt.gz
admin:utils system restart
```

| Commande | Usage |
| --- | --- |
| `show status` | Charge, mémoire, disque, version |
| `utils dbreplication runtimestate` | **État de la réplication** entre nœuds (problème courant) |
| `utils service list` / `restart` | Services |
| `utils ntp status` | Synchronisation horaire (indispensable au cluster) |
| `file get activelog …` | Récupérer des traces vers un serveur SFTP |
| `utils disaster_recovery backup network` | Lancer une sauvegarde DRS |
| `set network …` | Paramètres réseau (avec précautions en cluster) |

## Supervision et dépannage

| Outil | Usage |
| --- | --- |
| **RTMT** | Postes enregistrés, appels, alertes, *Session Trace* (échelle SIP d'un appel), collecte de traces |
| *Dialed Number Analyzer* | Simule le routage d'un numéro avec un CSS donné |
| Traces SDI/SDL | Analyse détaillée (TAC), avec *TranslatorX* ou *Collaboration Solutions Analyzer* |

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Appel sortant refusé (tonalité rapide) | CSS du poste ne contient pas la partition du route pattern | *Dialed Number Analyzer*, revoir CSS/partitions |
| Pas d'audio entre sites | Région/codec, CAC, routage | Régions, *Locations*, MTP/transcodeur |
| Téléphone non enregistré | DHCP option 150, certificat (ITL/CTL), device pool | Journaux du poste, RTMT |
| Modifications non répliquées | Réplication de base | `utils dbreplication runtimestate`, réparation selon la procédure Cisco |

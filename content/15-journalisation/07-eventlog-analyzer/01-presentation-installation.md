---
title: Présentation et installation
description: ManageEngine EventLog Analyzer — gestion des journaux et SIEM orienté conformité pour environnements Windows et réseau, fonctions (collecte Windows avec ou sans agent, syslog, rapports réglementaires, corrélation, alertes, intégrité des fichiers), éditions et licences par source, prérequis, installation sous Windows et Linux, ports et ajout des premières sources.
tags: [eventlog analyzer, manageengine, journaux, siem, conformité, windows, syslog, installation]
icon: info
---

**EventLog Analyzer** (ManageEngine, groupe Zoho) est une solution commerciale de **gestion des journaux** et de **SIEM** destinée aux PME et ETI, très utilisée dans les environnements **Windows / Active Directory**. Elle se distingue par un grand nombre de **rapports prêts à l'emploi** (connexions, changements de privilèges, accès aux fichiers, équipements réseau) et de modèles de **conformité** (PCI DSS, ISO 27001, RGPD, HIPAA, SOX, NIS2 selon les versions).

## Fonctions

| Fonction | Détail |
| --- | --- |
| Collecte Windows | Journaux d'événements par **agent** ou **sans agent** (WMI/RPC avec un compte de domaine) |
| Syslog | Routeurs, commutateurs, pare-feu (Cisco, Fortinet, Palo Alto, Sophos, Juniper, Check Point…), serveurs Linux/Unix |
| Applications | IIS, Apache, SQL Server, Oracle, Exchange, serveurs DHCP, imprimantes… |
| Rapports | Plus de 1 000 rapports prédéfinis, planifiables, exportables (PDF, CSV) |
| Corrélation | Règles combinant des événements de plusieurs sources (attaque par force brute suivie d'une connexion réussie…) |
| Alertes | Seuils, profils d'alerte, notifications (courriel, SMS), scripts et *workflows* de réponse |
| Intégrité des fichiers | Surveillance des fichiers et dossiers sensibles (Windows, Linux) |
| Archivage | Archives chiffrées et horodatées pour la conservation légale |
| Renseignement sur les menaces | Listes d'adresses malveillantes intégrées |

L'éditeur propose aussi **Log360**, suite qui associe EventLog Analyzer, ADAudit Plus (audit AD détaillé) et d'autres modules (UEBA, CASB).

## Éditions et licences

| Édition | Usage |
| --- | --- |
| Free | Jusqu'à 5 sources de journaux |
| Premium | Licence selon le nombre de **sources** (serveurs Windows, postes, équipements syslog, applications) |
| Distributed | Plusieurs serveurs gérés (sites, gros volumes) avec console centrale |

## Prérequis

| Élément | Indication |
| --- | --- |
| Système | Windows Server (recommandé pour la collecte sans agent) ou Linux 64 bits |
| Ressources | Selon le débit (événements/seconde) : 4-8 cœurs, 8-16 Go de RAM au minimum, disques rapides et volumineux pour l'index et les archives |
| Base | Base PostgreSQL intégrée (ou base externe selon les versions) et moteur de recherche intégré pour les journaux |
| Comptes | Compte de domaine avec droits de lecture des journaux d'événements (groupe *Event Log Readers*, droits WMI/DCOM) pour la collecte sans agent |

## Installation

### Windows

1. Exécuter l'installateur `ManageEngine_EventLogAnalyzer_64bit.exe`, choisir le répertoire et le **port web** (par défaut **8400**).
2. Installer comme **service Windows** (option proposée), démarrer le service.
3. Ouvrir `http://serveur:8400` : compte initial **admin / admin** → changement immédiat.

### Linux

```bash
chmod +x ManageEngine_EventLogAnalyzer_64bit.bin
sudo ./ManageEngine_EventLogAnalyzer_64bit.bin -i console          # installation en mode texte
cd /opt/ManageEngine/EventLog/bin
sudo sh configureAsService.sh -i                                   # installer le service (selon la version)
sudo systemctl start eventloganalyzer
```

## Ports

| Port | Usage |
| --- | --- |
| **8400** (HTTP) / port HTTPS configuré | Interface web |
| **514/UDP**, 513/UDP, TCP configurables | Réception syslog |
| 135, 139, 445, ports RPC dynamiques | Collecte Windows sans agent (WMI/RPC) |
| Port de communication des agents | Selon la version (agents vers le serveur) |

Configurez **HTTPS** (*Paramètres → Administration → Connexion*) avec un certificat de l'AC interne.

## Ajouter des sources

1. **Domaine** : déclarer le domaine AD (compte de service), découvrir les serveurs et postes.
2. **Sources Windows** : sélectionner les machines, choisir collecte avec ou sans agent, appliquer une **politique d'audit** adaptée (l'outil indique les catégories à activer par GPO).
3. **Sources syslog** : déclarer les équipements (adresse IP, type) et configurer chaque équipement pour envoyer son syslog vers le serveur — voir les exemples de [[01-rsyslog/02-centralisation-tls|configuration syslog des équipements]].
4. **Applications** : IIS, SQL Server, etc., par leurs journaux.

## Suite

[[02-utilisation-exploitation|Rapports, alertes, conformité et exploitation]]

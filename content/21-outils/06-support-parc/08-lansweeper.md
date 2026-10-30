---
title: Lansweeper
description: Lansweeper, découverte et inventaire des actifs informatiques — offres (Lansweeper Sites cloud, installation sur site historique), capteurs de balayage (scanning server, agent LsAgent, découverte passive), méthodes (WMI, SSH, SNMP, VMware, cloud), identifiants de balayage et leur sécurité, cibles et planification, rapports, détection des vulnérabilités et fins de vie, intégrations (ServiceNow, Intune, CMDB) et bonnes pratiques.
tags: [lansweeper, inventaire, découverte, cmdb, wmi, snmp, actifs]
icon: package-search
---

**Lansweeper** (commercial, gratuit jusqu'à un petit nombre d'actifs selon l'offre) découvre et inventorie **tous** les actifs du réseau : postes et serveurs Windows/Linux/macOS, équipements réseau, imprimantes, IoT, machines virtuelles, ressources cloud. Il est apprécié pour sa découverte **sans agent** et ses **rapports** prêts à l'emploi (logiciels installés, garanties, fins de vie, correctifs manquants).

## Architecture

| Composant | Rôle |
| --- | --- |
| **Lansweeper Sites** (cloud) | Console, rapports, tableaux de bord, intégrations — offre actuelle |
| **Capteur / serveur de balayage** | Installé sur site (Windows ou Linux) : réalise les balayages et envoie les données au site |
| **LsAgent** | Agent pour les machines nomades ou isolées (remonte par Internet via le relais cloud) |
| Découverte passive / détection d'appareils | Écoute du trafic (ARP, DHCP, mDNS…) pour repérer les appareils sans les interroger |
| Installation sur site (« Classic ») | Serveur Windows + SQL Server, en voie de remplacement par l'offre cloud |

## Méthodes de balayage

| Cible | Méthode | Prérequis |
| --- | --- | --- |
| Windows | **WMI**, registre distant, SMB | Compte de domaine **administrateur local** des machines (GPO), pare-feu (RPC/WMI, SMB) depuis le serveur de balayage |
| Linux / Unix / macOS | **SSH** | Compte dédié par clé, `sudo` restreint pour certaines informations (dmidecode) |
| Équipements réseau, imprimantes | **SNMP** (v3 de préférence) | Identifiants SNMP, ACL des équipements autorisant le serveur de balayage |
| VMware | API vCenter/ESXi | Compte en lecture |
| Cloud | API (Azure, AWS, Google Cloud) | Comptes de service en lecture |
| Microsoft 365, Entra ID, Intune | API Graph | Application enregistrée en lecture |

**Cibles** : plages IP, OU Active Directory, domaines ; planification (quotidienne, à la connexion de la machine pour les postes).

## Identifiants de balayage

> [!WARNING]
> Un compte administrateur local de **toutes** les machines est un compte extrêmement sensible : s'il est volé, l'attaquant contrôle le parc. Comptes **dédiés** au balayage, mots de passe longs et tournants, restriction des ouvertures de session interactives (*Interdire l'ouverture de session locale / par RDP*), surveillance de leur usage (connexions depuis d'autres sources que le serveur de balayage), et jamais un compte d'administrateur du domaine.

## Exploitation

- **Rapports** intégrés et personnalisés (requêtes) : logiciels non autorisés, versions de Windows hors support, machines sans antivirus ou sans BitLocker, garanties expirées, comptes administrateurs locaux.
- **Gestion des vulnérabilités** et fins de vie (selon l'offre) : correspondance logiciels ↔ CVE, alertes.
- **Intégrations** : ServiceNow, Jira, Intune, Microsoft Sentinel, API GraphQL ; export vers une CMDB ([[04-glpi-installation|GLPI]]).
- Comparer avec les sources de vérité (AD, Intune, IPAM, NetBox) pour repérer les appareils **inconnus** — un usage de sécurité très utile.

## Bonnes pratiques

- [ ] Serveur de balayage dans le réseau d'administration, avec les flux nécessaires uniquement
- [ ] SNMPv3 et SSH par clé plutôt que mots de passe et communautés
- [ ] Données d'inventaire considérées comme sensibles (carte du réseau) : accès restreint à la console, MFA
- [ ] Revue périodique des appareils non identifiés et des comptes de balayage

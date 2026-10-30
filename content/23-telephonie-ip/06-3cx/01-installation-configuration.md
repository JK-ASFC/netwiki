---
title: 3CX — installation et configuration
description: 3CX, IPBX logiciel commercial (édition gratuite limitée) — déploiements (Linux Debian, Windows selon version, hébergé, cloud), installation et outil de configuration web (port 5015), console d'administration, ports réseau, utilisateurs, provisionnement des postes, trunks SIP (modèles opérateurs), règles entrantes et sortantes, heures d'ouverture, standard automatique, groupes d'appel, files d'attente, applications Windows, macOS, Linux (web), Android et iOS.
tags: [3cx, ipbx, voip, debian, windows, trunk, provisionnement, applications]
icon: phone
---

**3CX** est un IPBX logiciel très répandu dans les PME : administration entièrement **graphique** (console web), applications pour tous les systèmes, provisionnement automatique des postes et intégrations (Microsoft 365, CRM). Il est proposé sous licences annuelles (par nombre d'appels simultanés ou d'utilisateurs selon les offres), avec une édition gratuite limitée.

## Déploiements

| Mode | Remarques |
| --- | --- |
| **Linux (Debian 12)** | Plateforme principale : image ISO 3CX (Debian préconfigurée) ou installation sur un Debian minimal existant |
| Windows | Selon la version de 3CX et de Windows Server : vérifier la matrice de compatibilité avant tout projet |
| Hébergé chez 3CX ou dans votre cloud | AWS, Azure, Google Cloud, OVH… via l'assistant 3CX |
| Mini-PC / Raspberry Pi | Petits sites (selon versions) |

## Installation (Debian)

1. Installer l'**ISO 3CX** (ou ajouter le dépôt 3CX sur un Debian 12 minimal selon la procédure de l'éditeur).
2. À la fin, ouvrir l'**outil de configuration web** : `http://<adresse-du-serveur>:5015`.
3. Saisir la clé de licence (ou créer une licence gratuite depuis le portail 3CX), le **FQDN** (sous-domaine 3CX fourni ou votre propre domaine avec certificat), l'adresse publique, les ports, l'extension de l'opérateur, le pays (plans de numérotation, urgences).
4. Se connecter à la **console d'administration** : `https://<fqdn>:5001` (port par défaut des installations sur site).

## Ports réseau

| Port | Usage |
| --- | --- |
| TCP 5001 (ou 443) | Console web, applications, provisionnement HTTPS |
| UDP/TCP 5060, TCP 5061 | SIP, SIP TLS |
| TCP/UDP 5090 | Tunnel 3CX (applications et postes distants sans VPN) |
| UDP 9000–10999 | RTP |

L'outil **Firewall Checker** de la console vérifie que les redirections de ports sont correctes (pare-feu et NAT). Désactivez l'**ALG SIP** du routeur.

## Configuration dans la console

| Menu | Usage |
| --- | --- |
| *Users* | Utilisateurs (numéro, nom, adresse électronique : 3CX envoie le message de bienvenue et les liens des applications), rôles (utilisateur, manager, administrateur système), messagerie vocale, renvois par statut (Disponible, Absent, Ne pas déranger…) |
| *Phones* | Postes IP provisionnés (Yealink, Fanvil, Snom…) : découverte automatique sur le LAN (PnP), modèle, adresse MAC |
| *Voice & Chat → Add Trunk* | Trunks SIP à partir de **modèles d'opérateurs** certifiés (paramètres préremplis) ou générique ; SDA ; numéro présenté |
| *Inbound Rules* | SDA → utilisateur, groupe, standard automatique ; règles hors horaires |
| *Outbound Rules* | Préfixes / longueurs de numéros → trunks, manipulation des numéros, restrictions par groupe |
| *Office Hours* | Horaires de l'entreprise, jours fériés |
| *Digital Receptionist* | Standard automatique (SVI) |
| *Ring Groups* / *Call Queues* | Groupes d'appel / files d'attente (stratégies, agents, statistiques) |
| *Groups* | Départements, droits, horaires spécifiques |
| *Integrations* | Microsoft 365 (annuaire, Teams), CRM |
| *Emergency Numbers* | Numéros d'urgence et numéro présenté pour les rappels |

## Applications

| Plateforme | Client |
| --- | --- |
| Windows | Application de bureau 3CX (ou client web) |
| macOS, Linux | Client web (navigateur) et extension Chrome/Edge |
| Android, iOS | Applications 3CX (notifications push) |

L'utilisateur se configure en scannant le **code QR** du message de bienvenue ou en ouvrant le fichier de configuration fourni.

Suite : [[02-exploitation-securite|exploitation, sauvegarde et sécurité]].

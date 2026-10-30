---
title: Panorama des autres IPBX et téléphonies cloud
description: Repères sur les autres solutions de téléphonie d'entreprise — Avaya (Aura, IP Office), Unify OpenScape, Yeastar, Grandstream UCM, Panasonic, NEC, solutions libres et françaises (Wazo, XiVO, Issabel, VitalPBX, Wildix), téléphonies cloud (Webex Calling, Zoom Phone, RingCentral, Aircall, Ringover), avec outils d'administration, systèmes supportés et critères de choix.
tags: [ipbx, avaya, unify, yeastar, grandstream, wazo, xivo, cloud, ucaas]
icon: layers
---

## IPBX sur site ou hybrides

| Solution | Cible | Administration | Remarques |
| --- | --- | --- | --- |
| **Avaya Aura** (Communication Manager, Session Manager, System Manager) | Grands comptes | **System Manager** (web), SAT (terminal) pour Communication Manager | Architecture SIP centralisée, nombreux sites historiques |
| **Avaya IP Office** | PME | **IP Office Manager** (Windows), **Web Manager** | Très répandu, nombreux postes numériques encore en service |
| **Unify OpenScape Business / OpenScape Voice** | PME / grands comptes | WBM (web), Assistant ; Common Management Portal | Unify a rejoint Mitel en 2023 |
| [[09-mitel/01-mivoice-administration\|Mitel MiVoice]] | PME à grands comptes | Web Admin, System Administration Tool | — |
| [[08-alcatel-omnipcx/01-omnipcx-enterprise\|Alcatel-Lucent OmniPCX]] | PME à grands comptes | OmniVista 8770, WBM | — |
| [[07-cisco-cme-cucm/02-cucm-administration\|Cisco CUCM / CME]] | Petits sites à grands comptes | Web (ccmadmin), CLI IOS | — |
| **Yeastar P-Series** | PME | Interface web (appliance, logiciel ou cloud), application Linkus | Configuration simple, intégrations Microsoft 365 |
| **Grandstream UCM6300/UCM63xx** | PME | Interface web, gestion cloud **GDMS** | Basé sur Asterisk, rapport qualité/prix |
| **Panasonic KX-NS / KX-NSX**, **NEC SV9100** | PME | Logiciels de maintenance Windows / web | Parc installé important |
| **3CX** | PME | Console web | Voir [[06-3cx/01-installation-configuration\|3CX]] |

## Solutions libres et éditeurs français

| Solution | Base | Particularités |
| --- | --- | --- |
| **Wazo Platform** | Asterisk + API | Plateforme de communication programmable (API REST), éditeur français |
| **XiVO** (Wisper) | Asterisk | IPBX libre français, interface web, centre d'appels |
| **Issabel** | Asterisk | Distribution IPBX libre (héritière d'Elastix) |
| **VitalPBX** | Asterisk | Interface moderne, multi-locataire |
| **FusionPBX** | FreeSWITCH | Interface web multi-locataire, voir [[04-freeswitch/01-presentation-installation\|FreeSWITCH]] |
| **Wildix** | Propriétaire (WebRTC) | Solution unifiée orientée navigateur, forte présence en Europe |

## Téléphonies cloud (UCaaS)

| Service | Points clés |
| --- | --- |
| [[10-teams-phone/01-teams-phone-direct-routing\|Microsoft Teams Phone]] | Intégré à Microsoft 365 |
| **Webex Calling** (Cisco) | Postes Cisco MPP, Webex App, Control Hub |
| **Zoom Phone** | Intégré à Zoom, numéros dans de nombreux pays |
| **RingCentral** | UCaaS international (a repris des clients cloud de Mitel) |
| **Aircall**, **Ringover** | Éditeurs français, orientés équipes commerciales/support, intégrations CRM |

## Critères de choix

| Critère | Questions |
| --- | --- |
| Taille et sites | Nombre d'utilisateurs, de sites, besoin de survie locale si le WAN tombe |
| Existant | Postes et câblage réutilisables, IPBX à faire coexister (Direct Routing, trunks inter-IPBX) |
| Fonctions | Centre de contacts, enregistrement, intégrations CRM/Teams, mobilité |
| Exploitation | Compétences internes (Linux, Windows), contrat de maintenance, intégrateur |
| Sécurité | Chiffrement, SBC, MFA, hébergement des données (UE), certifications |
| Coûts | Licences, matériel, opérateur, maintenance, sur 5 ans |
| Réglementation | Urgences et localisation, conservation des CDR, enregistrement des appels |

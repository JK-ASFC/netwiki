---
title: Plateformes Mitel et outils d'administration
description: Panorama des autocommutateurs et applications Mitel et de leurs outils de gestion — MiVoice 5000 (Web Admin, MiVoice 5000 Manager), MiVoice Business (System Administration Tool, Mitel Standard Linux, MiVoice Border Gateway, MiCollab), MX-ONE (Provisioning Manager, Service Node Manager), MiVoice Office 400 (WebAdmin), MiVoice Connect (Connect Director), SIP-DECT (OMM), supervision avec Mitel Performance Analytics, sauvegardes, sécurisation (fraude téléphonique, chiffrement, correctifs) et dépannage.
tags: [mitel, mivoice 5000, mivoice business, mx-one, micollab, mbg, administration, toip]
icon: phone
---

Les autocommutateurs Mitel s'administrent essentiellement par des **interfaces graphiques** (web ou clients dédiés) ; la ligne de commande sert surtout à la maintenance du système d'exploitation sous-jacent (Linux) et au support. Le tableau suivant aide à reconnaître la plateforme et son outil.

## Plateformes et outils

| Plateforme | Cible | Administration |
| --- | --- | --- |
| **MiVoice 5000** (ex-Aastra 5000) | ETI et grands comptes, très répandu en France ; serveur Linux, boîtiers (XS, XL, XD, AXD…) ou machine virtuelle | **Web Admin** (gestion d'un site), **MiVoice 5000 Manager** (gestion multisite centralisée : configuration, annuaire, alarmes, sauvegardes, déploiement logiciel) |
| **MiVoice Business** (MiVB, ex-3300 ICP) | ETI, grands comptes, multisite en grappe | **System Administration Tool** (web, dans l'*Embedded System Management*), Group Administration Tool, outils de maintenance ; versions logicielles sur **Mitel Standard Linux** (MSL, *server-manager* web) ou contrôleurs matériels |
| **MX-ONE** | Grands comptes, multisite étendu | **Provisioning Manager** (utilisateurs, postes), **Service Node Manager** (système), CLI Linux du serveur |
| **MiVoice Office 400** (ex-Aastra 400) | PME | **WebAdmin** (interface web embarquée) |
| **MiVoice Connect** (ex-ShoreTel) | PME, multisite | **Connect Director** (web) |
| SIP-DECT | Bornes DECT sur IP | **OMM** (*OpenMobility Manager*, web ou application) |

## Applications associées

| Application | Rôle |
| --- | --- |
| **MiCollab** | Communications unifiées : client de bureau et mobile, messagerie vocale, présence, audioconférence (sur MSL) |
| **MiVoice Border Gateway** (MBG) | SBC et passerelle d'accès distant (postes de télétravailleurs, trunks SIP opérateur), enregistrement des appels |
| MiContact Center | Centre de contacts (files d'attente, agents, statistiques) |
| **Mitel Performance Analytics** (MPA) | Supervision des systèmes Mitel : alarmes, disponibilité, qualité de voix (MOS), accès distant sécurisé pour la maintenance |
| Taxation / SMDR | Les tickets d'appels (CDR/SMDR) sont exportés vers un logiciel de taxation |

## Principes d'administration communs

| Tâche | Où |
| --- | --- |
| Créer un utilisateur et son poste | Outil de provisionnement de la plateforme (Web Admin, System Administration Tool, Provisioning Manager…) : numéro, type de poste, adresse MAC, classe de service, messagerie |
| Classes de service / restrictions | Catégories d'appels autorisés (local, national, international, numéros surtaxés) par utilisateur ou groupe |
| Trunks SIP | Paramètres opérateur (enregistrement, codecs, formats de numéros) — souvent via la MBG |
| Annuaire | Synchronisation LDAP/Active Directory |
| Postes SIP | Fichiers de configuration générés par le système (ou serveur de provisionnement), mises à jour de micrologiciel des postes |
| Sauvegardes | Planifiées depuis l'outil d'administration vers un serveur distant ; tester la restauration |

## Sécurisation

- [ ] **Mots de passe par défaut** remplacés (comptes d'administration du système, des postes, de la messagerie vocale) ; comptes nominatifs pour les administrateurs
- [ ] Interfaces d'administration accessibles **uniquement** depuis le réseau d'administration ; jamais exposées sur Internet (seule la MBG l'est, durcie)
- [ ] **Prévention de la fraude téléphonique** : interdire l'international et les numéros surtaxés sauf besoin, restreindre la réémission d'appels depuis la messagerie vocale (DISA), surveiller les volumes d'appels hors heures ouvrées
- [ ] Chiffrement de la signalisation (SIP TLS, MiNet sécurisé) et du média (SRTP)
- [ ] **Correctifs** suivis via les avis de sécurité Mitel — des vulnérabilités de MiVoice Connect (2022) et de MiCollab (2024) ont été exploitées activement
- [ ] Journaux et alarmes centralisés (syslog, MPA, SNMP)

## Dépannage

| Symptôme | Piste |
| --- | --- |
| Poste hors service après déménagement | Port de commutateur (VLAN voix, PoE), voir [[01-reseau-telephonie-ip\|réseau pour la téléphonie IP]] |
| Appels sortants impossibles | Classe de service de l'utilisateur, état du trunk SIP, format de numérotation |
| Appels entrants non routés | Plan de numérotation (SDA), règles de routage entrant |
| Qualité dégradée sur un site distant | Bande passante WAN, QoS, codec (G.729 sur liens faibles), statistiques MOS dans MPA |
| Télétravailleurs déconnectés | Certificats et état de la MBG, pare-feu en amont |

Pour un environnement **Alcatel-Lucent Enterprise** (OmniPCX Enterprise, commutateurs OmniSwitch), voir aussi [[09-alcatel-lucent-enterprise/02-omnivista-webview-depannage|ALE : OmniVista et dépannage]].

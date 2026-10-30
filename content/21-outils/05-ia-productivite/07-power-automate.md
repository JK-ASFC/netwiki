---
title: Power Automate
description: Microsoft Power Automate — flux cloud (déclencheurs, connecteurs standard et premium, Microsoft 365, Teams, SharePoint, approbations), Power Automate pour le bureau (RPA, Windows inclus), passerelle de données locale pour atteindre les ressources internes, environnements et solutions, stratégies de protection des données (DLP), licences, comptes de service, supervision et gouvernance (Center of Excellence), cas d'usage d'exploitation.
tags: [power automate, microsoft 365, rpa, flux, dlp, passerelle, automatisation]
icon: workflow
---

**Power Automate** (Microsoft) automatise des processus entre les services Microsoft 365 et des centaines de connecteurs, avec un concepteur visuel. Il complète les outils d'infrastructure ([[06-n8n|n8n]], scripts, Ansible) du côté **bureautique** : approbations, formulaires, notifications Teams, documents SharePoint.

| Type de flux | Usage |
| --- | --- |
| **Flux cloud** automatisés | Déclenchés par un événement (courriel reçu, fichier déposé, élément de liste créé, formulaire envoyé) |
| Flux planifiés | Exécution périodique (rapport hebdomadaire) |
| Flux instantanés | Lancés à la main (bouton, Teams) |
| **Power Automate pour le bureau** (RPA) | Automatiser des applications Windows et web sans API (inclus dans Windows 11) |
| Flux de processus métier | Étapes guidées dans Dataverse |

## Exemples d'exploitation

- Demande d'accès : formulaire **Forms** → **approbation** du responsable dans Teams → création d'un ticket ou d'une tâche → notification.
- Alerte : courriel de la supervision dans une boîte partagée → message dans le canal Teams de l'astreinte selon des mots-clés.
- Suivi des certificats : liste SharePoint des certificats → flux planifié qui alerte 30 jours avant l'expiration.
- Arrivée/départ : déclencheur RH → liste de contrôle, tâches Planner pour l'informatique.

## Atteindre les ressources internes

La **passerelle de données locale** (*on-premises data gateway*), installée sur un serveur interne, permet aux flux cloud d'accéder à SQL Server, fichiers, API internes sans ouvrir de port entrant (connexion sortante vers Azure Service Bus). Installez-la sur un serveur dédié, en **cluster** de plusieurs membres pour la disponibilité, avec un compte de récupération documenté.

## Licences

| Licence | Contenu |
| --- | --- |
| Incluse dans Microsoft 365 | Connecteurs **standard** (Microsoft 365, SharePoint, Outlook, Teams…) |
| Power Automate Premium (par utilisateur) | Connecteurs **premium** (HTTP, SQL Server, connecteurs personnalisés), RPA avec surveillance |
| Process / Hosted Process | Licence par flux / machine pour l'automatisation sans surveillance |

Le connecteur **HTTP** (appeler une API quelconque) est premium : vérifiez les licences avant de concevoir un flux.

## Gouvernance

| Élément | Recommandation |
| --- | --- |
| **Environnements** | Séparer développement, test, production ; l'environnement par défaut ne doit pas héberger de flux critiques |
| **Stratégies DLP** | Classer les connecteurs (*Business*, *Non-Business*, *Bloqué*) : empêcher qu'un flux copie des données SharePoint vers un service grand public |
| Solutions | Empaqueter flux et connexions pour les déployer d'un environnement à l'autre |
| Propriétaires | Flux critiques détenus par un **compte de service** (ou partagés avec un co-propriétaire), pas par un seul utilisateur qui pourrait partir |
| Inventaire | **CoE Starter Kit** (*Center of Excellence*) : inventaire des flux, des créateurs, des connecteurs utilisés |
| Journaux | Activités Power Platform dans le journal d'audit Microsoft Purview |

## Exploitation et dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Flux désactivé automatiquement | Échecs répétés, connexion expirée, licence | Historique d'exécution, réauthentifier la connexion |
| `Forbidden` / connecteur bloqué | Stratégie DLP | Revoir la classification ou le connecteur |
| Passerelle hors ligne | Service arrêté, proxy, compte | Application de la passerelle (diagnostics), journaux, cluster |
| Limites de requêtes | Quotas Power Platform par licence | Réduire la fréquence, regrouper les actions |
| Flux qui tourne en boucle | Déclencheur sur modification + action qui modifie le même élément | Conditions de déclencheur |

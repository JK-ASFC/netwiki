---
title: Appsmith, Budibase et ToolJet
description: Plates-formes low-code pour applications internes — principe (construire un back-office connecté à des bases et API par glisser-déposer, logique en JavaScript), Appsmith (widgets, requêtes SQL/REST/GraphQL, liaison par JS), Budibase (orienté données, base interne ou externe, automatisations, auto-hébergement simple), ToolJet (constructeur visuel, nombreux connecteurs, requêtes et transformations) ; cas d'usage, gouvernance et sécurité des connexions.
tags: [low-code, appsmith, budibase, tooljet, applications internes, back-office, api, javascript]
icon: blocks
---

Les plates-formes **low-code** servent à bâtir rapidement des **applications internes** — back-offices, outils de saisie, tableaux d'administration — en reliant par glisser-déposer des **widgets** (tables, formulaires, boutons) à des **sources de données** (bases SQL, API REST/GraphQL, feuilles). La logique s'écrit par petits morceaux de **JavaScript**. On gagne beaucoup de temps par rapport à un développement complet, pour les outils métier sans exigence particulière d'interface.

## Appsmith

**Appsmith** est orienté **développeur** : on place des widgets, on écrit des **requêtes** (SQL, REST, GraphQL, MongoDB…) et on relie les données avec du JavaScript (`{{ requete.data }}`). Beaucoup de connecteurs, gestion de versions, déploiement auto-hébergé.

```bash
docker run -d --name appsmith -p 127.0.0.1:8080:80 -p 127.0.0.1:4430:443 \
  -v /srv/appsmith:/appsmith-stacks appsmith/appsmith-ce
```

Idéal pour un **back-office sur une base existante** (CRUD enrichi, tableaux de bord opérationnels).

## Budibase

**Budibase** est plus **orienté données** et accessible : il peut utiliser sa **base interne** (sans serveur SQL à gérer) ou se connecter à une base externe, avec des **écrans** générés, des **automatisations** (déclencheurs → actions) et des formulaires. Installation auto-hébergée simple.

```bash
# Image tout-en-un (CouchDB, MinIO, Redis inclus) — pour la production, voir le compose du projet
docker run -d --name budibase -p 127.0.0.1:8080:80 \
  -v budibase_data:/data budibase/budibase:latest
```

Convient aux équipes **métier** qui veulent créer leurs outils avec peu de technique.

## ToolJet

**ToolJet** est un constructeur visuel avec de **nombreux connecteurs** (bases, API, services) : on compose l'interface, on écrit des **requêtes** et des **transformations** JavaScript, on gère les permissions. Positionnement proche d'Appsmith.

```bash
# Déploiement via le docker-compose du projet (serveur + PostgreSQL) ; variables TOOLJET_HOST, secrets
docker run -d --name tooljet -p 127.0.0.1:3000:3000 \
  -e TOOLJET_HOST=https://tooljet.exemple.fr -e SECRET_KEY_BASE='…' -e LOCKBOX_MASTER_KEY='…' \
  tooljet/tooljet:latest
```

## Cas d'usage et gouvernance

Exemples en IT : console pour réinitialiser des mots de passe (via API annuaire), interface de suivi des demandes, tableau de bord opérationnel reliant plusieurs bases, saisie de données métier.

> [!NOTE]
> Le low-code accélère, mais attention à la **gouvernance** : ces applications deviennent vite critiques sans être traitées comme du code. Bonnes pratiques : versionner les applications (export Git quand c'est possible), environnements de test et de production séparés, revue avant mise en production, propriétaire identifié, et documenter les dépendances (quelle base, quelle API).

## Sécurité

- Les **connexions** aux bases et API détiennent des identifiants : comptes de service à **privilèges minimaux**, secrets stockés dans la plate-forme (pas en dur dans les requêtes), réseau restreint.
- **Authentification** des utilisateurs (comptes, SSO/OIDC selon l'édition), rôles et permissions par application.
- HTTPS, sauvegardes (définition des applications **et** données internes), mises à jour.
- Attention aux requêtes **paramétrées** pour éviter l'injection SQL dans les champs libres.

## Choisir

| Besoin | Outil |
| --- | --- |
| Back-office sur base existante, orienté développeur | Appsmith, ToolJet |
| Outils créés par des profils métier, base interne possible | Budibase |
| Simple tableur partagé plutôt qu'application | [[09-bases-nocode/01-nocodb-baserow-grist\|NocoDB, Baserow, Grist]] |
| Application riche et pérenne | Développement classique |

Commandes : [[90-aide-memoire|aide-mémoire]].

---
title: NocoDB, Baserow et Grist
description: Bases de données no-code type tableur (alternatives à Airtable) — NocoDB (transforme une base MySQL/PostgreSQL/SQLite existante en interface tableur, vues grille/galerie/kanban, API REST et GraphQL auto-générée, webhooks), Baserow (base collaborative, champs riches, vues, plugins, API), Grist (cellules et colonnes avec formules de type tableur et Python, widgets, contrôle d'accès fin par ligne) ; cas d'usage en IT, API et sécurité des données.
tags: [nocodb, baserow, grist, no-code, airtable, base de données, tableur, api]
icon: table
---

Ces outils offrent une interface **tableur** sur une vraie base de données : créer des tables, des vues (grille, kanban, calendrier), des relations et des formulaires **sans coder**, avec une **API** générée automatiquement. Ce sont les alternatives libres à **Airtable**.

## NocoDB

**NocoDB** se branche sur une **base SQL existante** (MySQL, PostgreSQL, SQLite, SQL Server) ou crée la sienne, et l'expose comme un tableur collaboratif. Il **génère une API REST et GraphQL** et des webhooks, ce qui en fait aussi un moyen rapide de donner une interface à une base métier.

```bash
docker run -d --name nocodb -p 127.0.0.1:8080:8080 \
  -v /srv/nocodb:/usr/app/data \
  -e NC_DB="pg://db:5432?u=nocodb&p=…&d=nocodb" \
  nocodb/nocodb:latest
# Sans NC_DB : base SQLite locale dans le volume
```

Usages IT : suivi de projets, inventaire léger, registre de demandes, le tout avec une API pour l'intégration.

## Baserow

**Baserow** est une base de données **collaborative** pensée dès l'origine comme produit no-code : champs riches (fichiers, relations, formules, sélecteurs), vues multiples, formulaires, droits par équipe, **plugins**, API REST. Interface moderne et agréable.

```bash
docker run -d --name baserow -p 127.0.0.1:8080:80 \
  -e BASEROW_PUBLIC_URL=https://baserow.exemple.fr \
  -v /srv/baserow:/baserow/data \
  baserow/baserow:latest
```

## Grist

**Grist** se distingue par ses **formules** : chaque colonne peut être calculée avec une syntaxe de tableur **ou du Python**, ce qui permet des tableaux bien plus intelligents qu'Airtable. Il offre aussi des **widgets** personnalisables et un **contrôle d'accès fin** (jusqu'à la ligne et la colonne selon l'utilisateur).

```bash
docker run -d --name grist -p 127.0.0.1:8484:8484 \
  -v /srv/grist:/persist \
  -e GRIST_SESSION_SECRET='…' \
  gristlabs/grist:latest
```

Grist convient quand on a besoin de **calculs** (budgets, plannings, indicateurs) et d'un partage sélectif des données.

## Comparatif

| Critère | NocoDB | Baserow | Grist |
| --- | --- | --- | --- |
| Point fort | Interface sur base SQL existante + API | Produit no-code collaboratif | Formules tableur/Python, accès fin |
| Base sous-jacente | MySQL/PostgreSQL/SQLite/MSSQL | PostgreSQL | SQLite par document |
| API | REST + GraphQL | REST | REST + Python |
| Idéal pour | Donner une UI à une base métier | Suivi collaboratif d'équipe | Tableaux calculés, données sensibles |

## Sécurité

- Ces bases contiennent des **données métier** : HTTPS, authentification (comptes, SSO selon l'édition), sauvegardes régulières de la base **et** des fichiers joints.
- Les **clés d'API** et liens de partage public donnent accès aux données : les limiter, les faire expirer, ne partager en public que ce qui doit l'être.
- Pour une application plus riche qu'un tableau (logique métier, écrans sur mesure), voir [[10-low-code/01-appsmith-budibase-tooljet|Appsmith, Budibase, ToolJet]].

Commandes : [[90-aide-memoire|aide-mémoire]].

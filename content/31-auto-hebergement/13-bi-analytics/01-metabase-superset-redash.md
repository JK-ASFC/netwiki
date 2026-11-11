---
title: Metabase, Apache Superset, Redash, Lightdash et Evidence
description: Informatique décisionnelle (BI) auto-hébergée — Metabase (exploration sans SQL, questions, tableaux de bord, nombreuses bases, Docker, licence OSS vs Pro), Apache Superset (exploration et dataviz avancée, SQL Lab, cache, sécurité par rôles), Redash (requêtes SQL partagées et tableaux de bord, nombreuses sources), Lightdash (BI au-dessus de dbt, métriques définies dans le code) et Evidence (rapports en Markdown + SQL, site statique) ; connexions en lecture seule et choix.
tags: [bi, metabase, superset, redash, lightdash, evidence, tableaux de bord, dataviz, sql]
icon: chart-column
---

Les outils de **BI** (*Business Intelligence*) connectent une ou plusieurs bases de données et permettent d'**explorer** les données et de construire des **tableaux de bord** partagés. Ils s'adressent aux analystes et aux équipes métier, et complètent la supervision technique (Grafana).

## Metabase

**Metabase** est le plus **accessible** : on pose des « questions » via une interface **sans SQL** (ou en SQL pour les experts), on les assemble en tableaux de bord, avec filtres et partage. Très nombreux connecteurs (PostgreSQL, MySQL, SQL Server, BigQuery, ClickHouse…).

```bash
docker run -d --name metabase -p 127.0.0.1:3000:3000 \
  -e MB_DB_TYPE=postgres -e MB_DB_HOST=db -e MB_DB_DBNAME=metabase -e MB_DB_USER=metabase -e MB_DB_PASS='…' \
  -v /srv/metabase:/metabase-data metabase/metabase:latest
```

L'édition **open source** couvre l'essentiel ; certaines fonctions (permissions fines, mise en bac à sable des données) relèvent de l'édition **Pro/Enterprise**.

## Apache Superset

**Superset** vise l'**exploration et la visualisation avancées** : grande variété de graphiques, **SQL Lab** (éditeur SQL avec historique), mise en cache, et un modèle de **sécurité par rôles** fin. Plus riche mais plus exigeant à exploiter.

```bash
# docker-compose officiel (Superset + PostgreSQL + Redis + workers) ; init de l'admin au premier démarrage
docker compose -f docker-compose-image-tag.yml up -d
# Interface : http://serveur:8088
```

## Redash

**Redash** est centré sur la **requête SQL partagée** : on écrit des requêtes sur de nombreuses sources, on les visualise et on les combine en tableaux de bord, avec planification et alertes. Pratique quand les analystes sont à l'aise en SQL.

```bash
# Déploiement via le docker-compose du projet (serveur, workers, PostgreSQL, Redis)
docker compose run --rm server create_db && docker compose up -d
```

## Lightdash

**Lightdash** se branche sur un projet **[[28-data-analytique/06-transformation/01-dbt-sqlmesh|dbt]]** : les **métriques et dimensions** sont définies dans le code (fichiers dbt), et Lightdash les expose pour l'exploration et les tableaux de bord. Cohérence garantie (une seule définition des indicateurs), approche « BI as code ».

```bash
# Déploiement Docker/compose ; pointe vers le dépôt dbt (modèles + métriques)
```

## Evidence

**Evidence** génère des **rapports** à partir de fichiers **Markdown contenant du SQL** : on écrit le texte et les requêtes, Evidence produit un **site statique** avec graphiques. Idéal pour des rapports versionnés dans Git et publiés automatiquement.

```bash
npm install -g @evidence-dev/evidence
evidence build        # génère un site statique à héberger
```

## Connexions et sécurité

> [!WARNING]
> Un outil de BI se connecte aux bases **de production** ou à un entrepôt : **toujours utiliser un compte en lecture seule** (idéalement sur un réplica ou un entrepôt dédié, pour ne pas peser sur la production). Protéger l'accès (comptes, SSO/LDAP, rôles), chiffrer les connexions, et faire attention au **partage public** de tableaux de bord qui exposerait des données sensibles.

## Choisir

| Besoin | Outil |
| --- | --- |
| Accessible, sans SQL, déploiement rapide | Metabase |
| Dataviz avancée, SQL Lab, grands volumes | Apache Superset |
| Requêtes SQL partagées multi-sources | Redash |
| Métriques définies dans dbt (BI as code) | Lightdash |
| Rapports en Markdown + SQL, site statique | Evidence |
| Supervision technique (métriques système) | [[06-supervision/03-grafana/01-presentation-installation\|Grafana]] |

Commandes : [[90-aide-memoire|aide-mémoire]].

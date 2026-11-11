---
title: BI auto-hébergée — aide-mémoire
description: Déploiement et ports de Metabase, Apache Superset, Redash, Lightdash et Evidence, et rappel sur les connexions en lecture seule.
tags: [aide-mémoire, metabase, superset, redash, lightdash, evidence, bi]
icon: terminal
---

Explications : [[01-metabase-superset-redash|Metabase, Superset, Redash, Lightdash et Evidence]].

| Outil | Port | Point fort |
| --- | --- | --- |
| Metabase | 3000 | sans SQL, simple |
| Apache Superset | 8088 | dataviz avancée, SQL Lab |
| Redash | 5000 | requêtes SQL partagées |
| Lightdash | 8080 | métriques dbt |
| Evidence | site statique | rapports Markdown + SQL |

```bash
# Metabase
docker run -d -p 3000:3000 -e MB_DB_TYPE=postgres -e MB_DB_HOST=db -e MB_DB_DBNAME=metabase \
  -e MB_DB_USER=metabase -e MB_DB_PASS='…' -v /srv/metabase:/metabase-data metabase/metabase:latest

# Superset (compose officiel)
docker compose -f docker-compose-image-tag.yml up -d

# Redash
docker compose run --rm server create_db && docker compose up -d

# Evidence
npm install -g @evidence-dev/evidence ; evidence build
```

> Compte **lecture seule** vers les bases (réplica ou entrepôt de préférence) ; auth + rôles ; prudence sur les partages publics de tableaux de bord.

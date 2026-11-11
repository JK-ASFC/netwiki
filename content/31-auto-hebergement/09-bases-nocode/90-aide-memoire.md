---
title: NocoDB, Baserow et Grist — aide-mémoire
description: Déploiement Docker et ports de NocoDB (NC_DB), Baserow (BASEROW_PUBLIC_URL) et Grist (GRIST_SESSION_SECRET), et points de sauvegarde.
tags: [aide-mémoire, nocodb, baserow, grist, no-code, airtable]
icon: terminal
---

Explications : [[01-nocodb-baserow-grist|NocoDB, Baserow et Grist]].

| Outil | Port | Base |
| --- | --- | --- |
| NocoDB | 8080 | base SQL externe (NC_DB) ou SQLite |
| Baserow | 80 (conteneur) | PostgreSQL |
| Grist | 8484 | SQLite par document |

```bash
# NocoDB (sur PostgreSQL existant)
docker run -d -p 8080:8080 -v /srv/nocodb:/usr/app/data \
  -e NC_DB="pg://db:5432?u=nocodb&p=…&d=nocodb" nocodb/nocodb:latest

# Baserow
docker run -d -p 8080:80 -e BASEROW_PUBLIC_URL=https://baserow.exemple.fr \
  -v /srv/baserow:/baserow/data baserow/baserow:latest

# Grist
docker run -d -p 8484:8484 -v /srv/grist:/persist -e GRIST_SESSION_SECRET='…' gristlabs/grist:latest
```

> Sauvegarder base **et** fichiers joints ; HTTPS + authentification ; limiter clés d'API et partages publics.

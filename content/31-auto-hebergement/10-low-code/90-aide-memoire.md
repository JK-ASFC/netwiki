---
title: Appsmith, Budibase et ToolJet — aide-mémoire
description: Déploiement Docker et ports d'Appsmith, Budibase et ToolJet, variables essentielles et points de sécurité des connexions.
tags: [aide-mémoire, appsmith, budibase, tooljet, low-code]
icon: terminal
---

Explications : [[01-appsmith-budibase-tooljet|Appsmith, Budibase et ToolJet]].

| Outil | Port | Base |
| --- | --- | --- |
| Appsmith | 80/443 (conteneur) | MongoDB (inclus) |
| Budibase | 80 (conteneur) | CouchDB/MinIO (inclus) ou externe |
| ToolJet | 3000 | PostgreSQL |

```bash
# Appsmith
docker run -d -p 8080:80 -v /srv/appsmith:/appsmith-stacks appsmith/appsmith-ce

# Budibase
docker run -d -p 8080:80 -v budibase_data:/data budibase/budibase:latest

# ToolJet
docker run -d -p 3000:3000 -e TOOLJET_HOST=https://tooljet.exemple.fr \
  -e SECRET_KEY_BASE='…' -e LOCKBOX_MASTER_KEY='…' tooljet/tooljet:latest
```

> Comptes de service à privilèges minimaux, secrets dans la plate-forme, requêtes paramétrées, auth + rôles, sauvegardes (apps + données), versionner les applications.

---
title: BaaS auto-hébergés — aide-mémoire
description: Déploiement et ports de Supabase (docker compose), Appwrite (installeur), PocketBase (binaire serve) et Parse Server (Docker), avec les secrets à changer et la sauvegarde.
tags: [aide-mémoire, supabase, appwrite, pocketbase, parse server, baas]
icon: terminal
---

Explications : [[01-supabase-appwrite-pocketbase|Supabase, Appwrite, PocketBase et Parse Server]].

| BaaS | Base | Port |
| --- | --- | --- |
| Supabase | PostgreSQL | 8000 (passerelle Kong / Studio) |
| Appwrite | MariaDB + autres | 80/443 (conteneurs) |
| PocketBase | SQLite | 8090 |
| Parse Server | MongoDB (ou PostgreSQL) | 1337 |

```bash
# Supabase
git clone --depth 1 https://github.com/supabase/supabase && cd supabase/docker
cp .env.example .env     # changer POSTGRES_PASSWORD, JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY, Studio
docker compose up -d

# Appwrite
docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v /srv/appwrite:/usr/src/code/appwrite:rw --entrypoint="install" appwrite/appwrite:latest

# PocketBase
./pocketbase serve --http=0.0.0.0:8090     # admin : /_/  ; sauvegarde : copier pb_data/

# Parse Server
docker run -d -p 1337:1337 -e PARSE_SERVER_APPLICATION_ID='app' -e PARSE_SERVER_MASTER_KEY='…' \
  -e PARSE_SERVER_DATABASE_URI='mongodb://mongo:27017/parse' parseplatform/parse-server
```

> Règles d'accès configurées avant ouverture ; clé de service jamais côté client ; HTTPS ; sauvegarde base + fichiers.

---
title: FerretDB
description: FerretDB — alternative libre (Apache 2.0) à MongoDB qui parle le protocole MongoDB et stocke les données dans PostgreSQL avec l'extension DocumentDB : versions 1.x et 2.x, architecture, installation (Docker Compose avec l'image PostgreSQL DocumentDB, paquets .deb et .rpm, binaire), connexion avec mongosh et les pilotes MongoDB, authentification, compatibilité (commandes prises en charge, différences), sauvegarde via PostgreSQL ou mongodump, et cas d'usage (sortir de la licence SSPL).
tags: [ferretdb, mongodb, postgresql, documentdb, nosql, open source]
icon: info
---

**FerretDB** se fait passer pour un serveur [[03-mongodb/01-presentation-installation|MongoDB]] (port **27017**) mais enregistre les documents dans **PostgreSQL**. Il répond au besoin de garder des applications et outils MongoDB tout en restant sur une base 100 % libre, alors que MongoDB est sous licence SSPL depuis 2018. La version **2.x** s'appuie sur l'extension **DocumentDB** (Microsoft, MIT) pour de bien meilleures performances et compatibilité.

## Installation (Docker Compose)

```yaml
services:
  postgres:
    image: ghcr.io/ferretdb/postgres-documentdb:17
    environment:
      POSTGRES_USER: ferret
      POSTGRES_PASSWORD: MdpFerret2026
      POSTGRES_DB: postgres
    volumes: ["pgdata:/var/lib/postgresql/data"]
  ferretdb:
    image: ghcr.io/ferretdb/ferretdb:2
    ports: ["27017:27017"]
    environment:
      FERRETDB_POSTGRESQL_URL: postgres://ferret:MdpFerret2026@postgres:5432/postgres
volumes:
  pgdata:
```

```bash
docker compose up -d
mongosh "mongodb://ferret:MdpFerret2026@localhost:27017/"
```

Hors conteneur : paquets `.deb`/`.rpm` et binaires (Linux, macOS, Windows) depuis les versions GitHub, avec un PostgreSQL disposant de l'extension DocumentDB. Les identifiants MongoDB sont ceux de PostgreSQL.

## Compatibilité et exploitation

- La plupart des opérations CRUD, index et du pipeline d'agrégation sont prises en charge ; vérifier la liste des commandes non gérées (certaines commandes d'administration, transactions multi-documents selon la version) avant de migrer.
- Sauvegarde : celle de [[02-postgresql/05-sauvegarde-pitr|PostgreSQL]] (`pg_dump`, PITR) ou `mongodump`/`mongorestore` côté protocole.
- Supervision : métriques Prometheus exposées par FerretDB (`--debug-addr`), plus celles de PostgreSQL.

Suite : [[02-couchbase|Couchbase]] · [[03-ravendb|RavenDB]] · [[04-rethinkdb|RethinkDB]] · [[90-aide-memoire|aide-mémoire]].

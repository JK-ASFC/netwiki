---
title: Joplin Server — aide-mémoire des commandes
description: Commandes Joplin Server avec exemples — déploiement Docker Compose avec PostgreSQL, variables d'environnement (APP_BASE_URL, POSTGRES_*), premier administrateur, mise à jour, sauvegarde et restauration de la base, journaux, client Joplin en ligne de commande (configuration de la cible de synchronisation, sync, export), vérifications.
tags: [aide-mémoire, joplin, joplin server, docker, postgresql, notes]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-exploitation|Joplin Server]].

## Déploiement

```yaml
# /srv/joplin/compose.yaml
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: joplin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: joplin
    volumes:
      - ./pgdata:/var/lib/postgresql/data
  app:
    image: joplin/server:latest
    restart: unless-stopped
    depends_on: [db]
    ports:
      - "127.0.0.1:22300:22300"
    environment:
      APP_PORT: 22300
      APP_BASE_URL: https://notes.exemple.fr
      DB_CLIENT: pg
      POSTGRES_HOST: db
      POSTGRES_PORT: 5432
      POSTGRES_DATABASE: joplin
      POSTGRES_USER: joplin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

```bash
cd /srv/joplin && docker compose up -d && docker compose logs -f app
# Première connexion : https://notes.exemple.fr (compte administrateur par défaut à modifier immédiatement)
docker compose pull && docker compose up -d       # mise à jour
```

## Sauvegarde et restauration

```bash
docker compose exec -T db pg_dump -U joplin -Fc joplin > /srv/sauvegardes/joplin-$(date +%F).dump
docker compose exec -T db pg_restore -U joplin -d joplin --clean < /srv/sauvegardes/joplin-2026-10-29.dump
```

## Client en ligne de commande

```bash
npm install -g joplin
joplin config sync.target 9                         # 9 = Joplin Server
joplin config sync.9.path https://notes.exemple.fr
joplin config sync.9.username alice.martin@exemple.fr
joplin config sync.9.password 'MotDePasse'
joplin sync
joplin ls /
joplin export --format md /srv/export-notes
```

Clients graphiques : application Joplin pour Windows, macOS, Linux, Android et iOS (*Synchronisation → Joplin Server*). Activez le **chiffrement de bout en bout** dans les clients.

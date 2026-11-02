---
title: Édition collaborative — aide-mémoire des commandes
description: Commandes HedgeDoc (docker compose, manage_users, sauvegarde PostgreSQL), Etherpad (installateur, pnpm run prod, Docker, extensions, sauvegarde) et CryptPad (installation depuis les sources, mise à jour, Docker, sauvegarde des dossiers de données).
tags: [aide-mémoire, hedgedoc, etherpad, cryptpad]
icon: terminal
---

Explications : [[01-hedgedoc-etherpad-cryptpad|HedgeDoc, Etherpad et CryptPad]].

```bash
docker compose up -d && docker compose logs -f app                           # HedgeDoc
docker compose exec app bin/manage_users --add jk@corp.exemple.fr
docker compose exec -T database pg_dump -U hedgedoc hedgedoc > /srv/sauvegardes/hedgedoc-$(date +%F).sql
cd etherpad-lite && pnpm run prod                                             # Etherpad (hors Docker)
docker compose exec -T postgres pg_dump -U etherpad etherpad > /srv/sauvegardes/etherpad-$(date +%F).sql
cd /opt/cryptpad && git fetch --tags && git checkout $(git tag --sort=-v:refname | head -1) && npm ci && npm run install:components   # CryptPad
sudo tar czf /srv/sauvegardes/cryptpad-$(date +%F).tar.gz -C /opt/cryptpad blob block data datastore config
```

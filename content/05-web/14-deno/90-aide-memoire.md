---
title: Deno — aide-mémoire des commandes
description: Commandes Deno avec exemples — installation et mise à jour (deno upgrade), exécution et permissions (--allow-net, --allow-read, --deny), deno serve, tâches, tests, formatage, audit des dépendances, deno compile (compilation croisée), conteneur Docker et service systemd.
tags: [aide-mémoire, deno, javascript, typescript, permissions, compile]
icon: terminal
---

Explications : [[01-presentation-installation|Deno]].

## Installation et version

```bash
curl -fsSL https://deno.land/install.sh | sh
deno --version
deno upgrade
deno upgrade --version 2.7.0
```

```powershell
winget install DenoLand.Deno
winget upgrade DenoLand.Deno
```

## Exécuter avec permissions

```bash
deno run --allow-net=api.exemple.fr main.ts
deno run --allow-read=./data --allow-write=./sortie main.ts
deno run --allow-env=DATABASE_URL main.ts
deno run --allow-run=git main.ts
deno run --allow-read --deny-read=/etc main.ts
deno run --no-prompt --allow-net main.ts       # échec direct si permission manquante
deno run --watch --allow-net main.ts           # redémarrage à chaque modification
```

## Serveur HTTP

```bash
deno serve server.ts
deno serve --host=127.0.0.1 --port=8080 server.ts
deno serve --parallel server.ts                # un worker par cœur
```

## Qualité et dépendances

```bash
deno fmt                      # formater
deno lint                     # analyser
deno test --allow-read        # tests
deno audit                    # vulnérabilités des dépendances
```

## Binaire autonome

```bash
deno compile --allow-net --output appli-api server.ts
deno compile --target aarch64-unknown-linux-gnu --output appli-api-arm server.ts
deno compile --include data --allow-read --output appli-api server.ts
```

## Conteneur et service

```bash
docker run --rm -it -p 8000:8000 -v "$PWD":/app -w /app denoland/deno:2 deno run --allow-net main.ts
sudo systemctl status appli-api
journalctl -u appli-api -f
```

## Variables utiles

| Variable | Rôle |
| --- | --- |
| `DENO_DIR` | Dossier du cache (`DENO_DIR=/var/cache/appli-api`) |
| `DENO_NO_PROMPT=1` | Aucune question interactive |
| `DENO_NO_UPDATE_CHECK=1` | Pas de vérification de nouvelle version |

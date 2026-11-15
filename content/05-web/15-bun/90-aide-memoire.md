---
title: Bun — aide-mémoire des commandes
description: Commandes Bun avec exemples — version, upgrade, init, install (--frozen-lockfile, --production), add, remove, update, outdated, run, --watch, --hot, bunx, test (--watch, --coverage), build (--compile, --target, --minify), pm ls, cache, variables d'environnement (.env).
tags: [aide-mémoire, bun, javascript, typescript]
icon: terminal
---

Explications : [[01-presentation-installation|Bun]].

```bash
bun --version ; bun upgrade
bun init -y
bun install --frozen-lockfile          # CI : échoue si bun.lock n'est pas à jour
bun install --production               # sans devDependencies
bun add zod ; bun add -d typescript ; bun remove zod
bun update ; bun outdated
bun run dev ; bun run --watch src/index.ts ; bun --hot src/index.ts
bunx tsc --noEmit
bun test ; bun test --watch ; bun test --coverage
bun build src/index.ts --outdir dist --minify --target node
bun build src/index.ts --compile --target=bun-linux-x64 --outfile app   # compilation croisée
bun pm ls ; bun pm cache rm
bun --env-file=.env.production run src/index.ts
```

## Installation et service

```bash
curl -fsSL https://bun.sh/install | bash             # Linux, macOS (dans ~/.bun)
brew install oven-sh/bun/bun                         # macOS
npm install -g bun
powershell -c "irm bun.sh/install.ps1 | iex"         # Windows
docker run --rm -v "$PWD":/app -w /app oven/bun:1 bun test
```

```ini /etc/systemd/system/api-bun.service
[Unit]
Description=API Bun
After=network-online.target

[Service]
User=app
WorkingDirectory=/opt/api-bun
EnvironmentFile=/etc/api-bun/env
ExecStart=/opt/api-bun/app
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

`/opt/api-bun/app` est le binaire autonome produit par `bun build --compile` : aucun Bun n'est nécessaire sur le serveur.

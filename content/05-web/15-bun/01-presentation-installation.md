---
title: Présentation, installation et exploitation
description: Bun — runtime JavaScript et TypeScript (moteur JavaScriptCore, écrit en Zig) qui regroupe exécution, gestionnaire de paquets compatible npm, lanceur de tests, bundler et compilation en exécutable autonome : installation Linux, macOS, Windows, Docker, commandes (init, install, add, run, test, build, bunx, upgrade), serveur HTTP Bun.serve, compatibilité Node.js, déploiement avec systemd ou conteneur, et précautions en production.
tags: [bun, javascript, typescript, runtime, npm, node.js]
icon: info
---

**Bun** (MIT) remplace à lui seul `node`, `npm`, `jest`/`vitest` et un bundler : il exécute directement le **TypeScript**, installe les dépendances de `package.json` beaucoup plus vite que npm et compile une application en **binaire autonome**. Il vise la compatibilité avec les API de [[06-nodejs/01-presentation-installation|Node.js]] ; la plupart des paquets npm fonctionnent tels quels.

## Installation

| Système | Commande |
| --- | --- |
| Linux, macOS | `curl -fsSL https://bun.sh/install \| bash` (installe dans `~/.bun/bin`) |
| Windows 10/11 | `powershell -c "irm bun.sh/install.ps1 \| iex"` ou `winget install Oven-sh.Bun` |
| macOS (Homebrew) | `brew install oven-sh/bun/bun` |
| Via npm | `npm install -g bun` |
| Docker | image `oven/bun` (variantes `alpine`, `distroless`) |

```bash
bun --version
bun upgrade            # mise à jour (bun upgrade --canary pour la préversion)
```

## Utilisation

```bash
bun init                       # nouveau projet (package.json, tsconfig.json, index.ts)
bun install                    # dépendances (fichier de verrou bun.lock)
bun add hono ; bun add -d @types/node ; bun remove hono
bun run index.ts               # exécuter (TypeScript natif)
bun run --watch index.ts       # relancer à chaque modification
bun run build                  # script « build » de package.json
bunx prettier --check .        # équivalent de npx
bun test                       # tests compatibles Jest (describe, it, expect)
bun build ./index.ts --outdir ./dist --target bun
bun build ./index.ts --compile --outfile api-inventaire   # exécutable autonome
```

Serveur HTTP minimal :

```typescript
// index.ts
Bun.serve({
  port: 3000,
  hostname: "127.0.0.1",
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/sante") return Response.json({ etat: "ok" });
    return new Response("Introuvable", { status: 404 });
  },
});
```

## Déploiement

```bash
sudo tee /etc/systemd/system/api-inventaire.service >/dev/null <<'UNIT'
[Unit]
Description=API inventaire (Bun)
After=network-online.target
[Service]
User=api
WorkingDirectory=/opt/api-inventaire
ExecStart=/opt/api-inventaire/api-inventaire
Environment=NODE_ENV=production
Restart=on-failure
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload && sudo systemctl enable --now api-inventaire
```

Publiez derrière [[03-nginx/01-presentation|NGINX]] ou [[04-caddy/01-presentation-installation|Caddy]] pour TLS et journaux.

> [!NOTE]
> Bun évolue vite : testez votre application (et ses modules natifs) avant de remplacer Node.js en production, et figez la version (`"packageManager"` ou image Docker étiquetée).

Commandes : [[90-aide-memoire|aide-mémoire]].

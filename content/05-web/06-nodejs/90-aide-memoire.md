---
title: Node.js — aide-mémoire des commandes
description: Commandes Node.js avec exemples — versions (nvm, fnm, Volta, nvm-windows), npm (install, ci, audit, outdated, update, run, scripts, cache, config, registre), npx, pnpm et Yarn via Corepack, exécution en production (variables, --env-file, --max-old-space-size, inspection), PM2 (start, cluster, logs, startup, reload), service systemd, diagnostic (node --inspect, --trace-warnings, --prof).
tags: [aide-mémoire, nodejs, npm, pnpm, pm2, nvm]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Node.js]].

## Versions

```bash
node -v && npm -v
# nvm (Linux, macOS)
nvm install --lts
nvm install 22
nvm use 22
nvm alias default 22
nvm ls
# fnm (rapide, multi-OS)
fnm install --lts && fnm use lts-latest
```

```powershell
# Windows
winget install OpenJS.NodeJS.LTS
nvm install lts; nvm use lts         # nvm-windows
```

## npm

```bash
npm init -y
npm install express                  # dépendance
npm install -D eslint                # dépendance de développement
npm install -g npm@latest            # mettre à jour npm
npm ci                               # installation reproductible depuis package-lock.json (CI, production)
npm ci --omit=dev                    # sans les dépendances de développement
npm outdated
npm update
npm audit
npm audit fix
npm ls --depth=0
npm run build
npm test
npm cache verify
npm config get registry
npm config set registry https://nexus.exemple.fr/repository/npm/      # registre interne
npm pack                             # créer l'archive du paquet
npx create-vite@latest mon-app       # exécuter un outil sans l'installer
```

## pnpm et Yarn (Corepack)

```bash
corepack enable
corepack use pnpm@latest
pnpm install --frozen-lockfile
pnpm add zod
pnpm -r build                        # monorepo : tous les paquets
yarn install --immutable
```

## Exécution

```bash
NODE_ENV=production node server.js
node --env-file=.env server.js                    # Node 20.6+
node --max-old-space-size=2048 server.js          # mémoire du tas (Mo)
node --watch server.js                            # redémarrage automatique (développement)
node --inspect=127.0.0.1:9229 server.js           # débogueur (Chrome : chrome://inspect)
node --trace-warnings --unhandled-rejections=strict server.js
node --prof server.js && node --prof-process isolate-*.log > profil.txt
node -e "console.log(require('os').cpus().length)"
```

## PM2

```bash
npm install -g pm2
pm2 start server.js --name api -i max            # mode cluster, un processus par cœur
pm2 start ecosystem.config.js --env production
pm2 list
pm2 logs api --lines 100
pm2 monit
pm2 reload api                                   # redémarrage sans interruption
pm2 restart api
pm2 stop api && pm2 delete api
pm2 save                                         # mémoriser la liste des processus
pm2 startup systemd                              # générer le service de démarrage
pm2 install pm2-logrotate
```

## Service systemd

```ini
# /etc/systemd/system/api.service
[Unit]
Description=API Node.js
After=network.target

[Service]
User=api
WorkingDirectory=/opt/api
EnvironmentFile=/opt/api/.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/opt/api/data

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now api && journalctl -u api -f
```

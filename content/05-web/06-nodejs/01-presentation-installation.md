---
title: Présentation et installation
description: Node.js — moteur V8 et boucle d'événements, versions LTS et cycle de vie, installation (paquets NodeSource ou distribution, nvm et fnm, Windows, macOS), npm, pnpm et Corepack, structure d'un déploiement, variables d'environnement, exécution en service systemd avec un utilisateur dédié, PM2 et Windows (service), cluster et threads.
tags: [node.js, javascript, installation, lts, npm, systemd, pm2, nvm]
icon: info
---

**Node.js** exécute du JavaScript côté serveur sur le moteur **V8**, avec une **boucle d'événements** non bloquante : très efficace pour les API, le temps réel (WebSocket) et les outils (beaucoup d'outils d'administration et de développement sont écrits en Node.js). Un processus Node.js n'utilise qu'un cœur pour le code JavaScript : on lance plusieurs processus pour exploiter un serveur.

## Versions

| Type | Principe |
| --- | --- |
| **LTS** (numéros pairs : 20, 22, 24…) | Support long (~30 mois) — **à utiliser en production** |
| Current (impairs) | Dernières fonctions, durée de vie courte |

Vérifiez la date de fin de vie de la version utilisée (calendrier publié sur nodejs.org) et la version exigée par l'application (`engines` dans `package.json`, fichier `.nvmrc`).

## Installation

```bash
# Debian / Ubuntu — dépôt NodeSource (version LTS choisie)
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh && sudo apt install -y nodejs
node -v && npm -v

# RHEL 9 — flux de modules
sudo dnf module list nodejs
sudo dnf module install nodejs:22

# Gestionnaire de versions par utilisateur (développement, plusieurs versions)
curl -fsSL https://fnm.vercel.app/install | bash      # ou nvm
fnm install --lts && fnm use --lts

# macOS
brew install node@22
```

```powershell
winget install OpenJS.NodeJS.LTS        # Windows
```

**Corepack** (inclus jusqu'à Node.js 24, ensuite paquet séparé) active **pnpm** ou **Yarn** à la version déclarée par le projet (`"packageManager"` dans `package.json`).

## Déploiement

```bash
# Utilisateur dédié, code en lecture seule, dépendances de production uniquement
sudo useradd -r -m -d /srv/appli-api -s /usr/sbin/nologin appli-api
cd /srv/appli-api/current
npm ci --omit=dev                 # installation reproductible depuis package-lock.json
npm audit --omit=dev              # vulnérabilités connues des dépendances
```

Configuration par **variables d'environnement** (jamais de secrets dans le dépôt) :

```ini /etc/appli-api/env (droits 0640, groupe appli-api)
NODE_ENV=production
PORT=3000
HOST=127.0.0.1
DATABASE_URL=postgres://appli:MotDePasse@srv-db-01:5432/appli
LOG_LEVEL=info
```

## Service systemd

```ini /etc/systemd/system/appli-api.service
[Unit]
Description=API appli (Node.js)
After=network-online.target
Wants=network-online.target

[Service]
User=appli-api
Group=appli-api
WorkingDirectory=/srv/appli-api/current
EnvironmentFile=/etc/appli-api/env
ExecStart=/usr/bin/node --enable-source-maps server.js
Restart=on-failure
RestartSec=5
# Durcissement
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/appli-api/data /var/log/appli-api
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now appli-api
journalctl -u appli-api -f
```

Pour utiliser plusieurs cœurs : plusieurs unités (`appli-api@3000`, `appli-api@3001`… avec une unité modèle) derrière le reverse proxy, ou le module **cluster** / un gestionnaire comme PM2.

## PM2

```bash
sudo npm install -g pm2
pm2 start server.js --name appli-api -i max --env production     # mode cluster : un processus par cœur
pm2 save && pm2 startup systemd -u appli-api --hp /srv/appli-api  # démarrage au boot
pm2 status && pm2 logs appli-api && pm2 reload appli-api          # rechargement sans coupure
```

PM2 est pratique (cluster, rechargement à chaud, journaux) ; systemd suffit souvent et s'intègre mieux à l'exploitation Linux.

## Windows

Exécution comme **service Windows** avec NSSM, WinSW ou `node-windows`, ou derrière **IIS** avec le module *HttpPlatformHandler* / iisnode (déprécié) ; un reverse proxy IIS (ARR) vers `http://127.0.0.1:3000` est la solution la plus simple ([[01-iis/06-url-rewrite-arr|URL Rewrite et ARR]]).

Suite : [[02-proxy-securite-exploitation|reverse proxy, sécurité et exploitation]].

---
title: Node-RED — aide-mémoire des commandes
description: Commandes Node-RED — installation (npm, script Raspberry Pi, Docker), service systemd, settings.js, génération du hachage de mot de passe (node-red admin hash-pw), installation de nœuds de palette (npm), dossier de données et sauvegarde, CLI node-red-admin, journaux et endpoints.
tags: [aide-mémoire, node-red, iot, mqtt, nodejs]
icon: terminal
---

Explications : [[01-presentation-installation|Node-RED]].

```bash
# Installation
sudo npm install -g --unsafe-perm node-red
bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)   # Debian/Pi
docker run -d -p 1880:1880 -v node_red_data:/data --name nodered nodered/node-red

# Service et journaux
sudo systemctl enable --now nodered ; sudo systemctl restart nodered ; sudo journalctl -u nodered -f

# Sécurité : hachage de mot de passe pour adminAuth / httpNodeAuth
node-red admin hash-pw

# Palette : installer des nœuds (dans le dossier de données)
cd ~/.node-red && npm install node-red-dashboard node-red-contrib-home-assistant-websocket && sudo systemctl restart nodered

# Dossier de données à sauvegarder (CONSERVER credentialSecret)
#   ~/.node-red/{flows.json, flows_cred.json, settings.js, node_modules/}   (Docker : /data)
tar czf nodered-$(date +%F).tgz -C ~ .node-red

# CLI d'administration distante (paquet node-red-admin)
npm install -g node-red-admin
node-red-admin login ; node-red-admin list ; node-red-admin hash-pw
```

Ports : **1880** (éditeur et API d'administration), `/ui` pour le tableau de bord. L'API REST d'administration (`/flows`, `/nodes`) est protégée par `adminAuth`.

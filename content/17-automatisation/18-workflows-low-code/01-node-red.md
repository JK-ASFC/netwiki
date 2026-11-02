---
title: Node-RED
description: Node-RED (OpenJS Foundation, Apache 2.0) — programmation visuelle de flux pour l'IoT, l'intégration et l'automatisation : installation (npm sur Linux, Windows et macOS, script pour Debian et Raspberry Pi, Docker), éditeur web (port 1880), nœuds (inject, debug, function, change, switch, http in/request, mqtt, tcp, exec, file, delay), palette de nœuds supplémentaires (Modbus, SNMP, InfluxDB, Telegram, bases de données), contexte et variables, sous-flux, projets Git, sécurisation (adminAuth, HTTPS, settings.js), sauvegarde des flux et exemples (supervision MQTT vers InfluxDB, webhook vers alerte).
tags: [node-red, low-code, iot, mqtt, automatisation, flux]
icon: info
---

**Node-RED** relie des **nœuds** par glisser-déposer pour transformer et router des messages : capteurs MQTT ([[05-mosquitto/01-presentation-configuration|Mosquitto]]), API HTTP, bases de données, fichiers, commandes système. Très utilisé en IoT, domotique, supervision industrielle et pour des intégrations rapides. Pour des workflows métier avec de nombreuses applications SaaS, voir aussi [[05-ia-productivite/06-n8n|n8n]] et [[02-huginn-activepieces-windmill|Activepieces]].

## Installation

```bash
# Debian, Ubuntu, Raspberry Pi OS : script officiel (Node.js LTS + service systemd nodered)
bash <(curl -sL https://github.com/node-red/linux-installers/releases/latest/download/update-nodejs-and-nodered-deb)
sudo systemctl enable --now nodered          # éditeur http://<hôte>:1880
# Toutes plates-formes avec Node.js : npm install -g --unsafe-perm node-red && node-red
docker run -d -p 1880:1880 -v node_red_data:/data --name nodered nodered/node-red
```

Windows : `npm install -g --unsafe-perm node-red` puis service via NSSM ou PM2.

## Sécuriser

```bash
node-red admin hash-pw              # hacher un mot de passe
```

```javascript
// ~/.node-red/settings.js (extraits)
adminAuth: { type: "credentials", users: [{ username: "admin", password: "$2b$08$…", permissions: "*" }] },
https: { key: require("fs").readFileSync("/etc/nodered/tls.key"), cert: require("fs").readFileSync("/etc/nodered/tls.crt") },
credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET,
```

Sans `adminAuth`, n'importe qui accédant au port 1880 peut exécuter du code sur le serveur (nœuds *exec* et *function*).

## Exemple de flux

`mqtt in` (topic `usine/+/temperature`) → `change` (extraire la valeur) → `switch` (> 60 °C) → `http request` vers un webhook d'alerte (Teams, [[17-stackstorm/01-presentation-installation|StackStorm]]) ; en parallèle `influxdb out` vers [[10-influxdb/01-presentation-installation|InfluxDB]] pour les graphiques Grafana.

Flux enregistrés dans `~/.node-red/flows.json` : sauvegarder ce fichier, `flows_cred.json` et `settings.js`, ou activer les **projets** (dépôt Git).

<!-- CAPTURE: Node-RED — éditeur de flux | _assets/node-red-editeur.png -->

Suite : [[02-huginn-activepieces-windmill|Huginn, Activepieces et Windmill]] · [[90-aide-memoire|aide-mémoire]].

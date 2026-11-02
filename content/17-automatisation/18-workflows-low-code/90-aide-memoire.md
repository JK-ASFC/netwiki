---
title: Node-RED, Huginn, Activepieces et Windmill — aide-mémoire
description: Commandes Node-RED (node-red, node-red-start/stop/log, node-red admin hash-pw/list/install, npm install de nœuds, sauvegarde de flows.json, API admin /flows), Huginn (docker, rake), Activepieces et Windmill (docker compose, mises à jour, CLI wmill : workspace add, sync pull/push, script run) avec exemples.
tags: [aide-mémoire, node-red, huginn, activepieces, windmill]
icon: terminal
---

Explications : [[01-node-red|Node-RED]] · [[02-huginn-activepieces-windmill|Huginn, Activepieces et Windmill]].

```bash
node-red-start ; node-red-stop ; node-red-log ; sudo systemctl status nodered
node-red admin hash-pw ; node-red admin login ; node-red admin list ; node-red admin install node-red-contrib-modbus
cd ~/.node-red && npm install node-red-node-snmp && node-red-restart ; cp ~/.node-red/flows*.json /sauv/
curl -s -H "Authorization: Bearer $JETON" http://localhost:1880/flows | jq length
docker logs -f huginn ; docker compose -p activepieces pull && docker compose -p activepieces up -d
npm install -g windmill-cli ; wmill workspace add corp corp https://windmill.corp.exemple.fr ; wmill sync pull ; wmill sync push ; wmill script run f/infra/prefixes -d '{"prefixe":"10.0.20"}'
```

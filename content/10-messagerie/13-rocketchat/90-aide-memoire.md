---
title: Rocket.Chat — aide-mémoire des commandes
description: Commandes Rocket.Chat avec exemples — pile Docker Compose officielle (démarrage, journaux, mise à jour), état du replica set MongoDB, sauvegarde mongodump et restauration, API REST (info, login, utilisateurs, salons, message), clients winget et Homebrew.
tags: [aide-mémoire, rocket.chat, docker, mongodb, api]
icon: terminal
---

Explications : [[01-presentation-installation|installation et configuration]] · [[02-interface-graphique|interface]].

```bash
cd rocketchat-compose
F="-f compose.monitoring.yml -f compose.traefik.yml -f compose.database.yml -f compose.yml -f compose.nats.yml -f docker.yml"
docker compose $F up -d ; docker compose $F ps
docker compose $F logs -f rocketchat
sed -i 's/^RELEASE=.*/RELEASE=8.9.0/' .env && docker compose $F pull && docker compose $F up -d     # mise à jour
docker compose $F exec mongodb mongosh --quiet --eval 'rs.status().members.map(m => m.stateStr)'
mongodump --uri "mongodb://127.0.0.1:27017/rocketchat?directConnection=true" --gzip --archive=/srv/sauvegardes/rocketchat-$(date +%F).archive.gz
mongorestore --uri "mongodb://127.0.0.1:27017/?directConnection=true" --gzip --drop --archive=/srv/sauvegardes/rocketchat-2026-11-02.archive.gz
```

## API REST

```bash
S=https://chat.corp.exemple.fr
curl -s $S/api/info | jq
curl -s -X POST $S/api/v1/login -H 'Content-Type: application/json' -d '{"user": "admin", "password": "MdpAdmin2026"}' | jq -r '.data.authToken, .data.userId'
H=(-H "X-Auth-Token: $JETON" -H "X-User-Id: $ID_UTILISATEUR" -H 'Content-Type: application/json')
curl -s "${H[@]}" $S/api/v1/users.list | jq '.users[].username'
curl -s "${H[@]}" -X POST $S/api/v1/users.create -d '{"email": "jk@corp.exemple.fr", "name": "JK", "username": "jk", "password": "MdpTemporaire2026!"}'
curl -s "${H[@]}" -X POST $S/api/v1/channels.create -d '{"name": "supervision"}'
curl -s "${H[@]}" -X POST $S/api/v1/chat.postMessage -d '{"channel": "#supervision", "text": "Sauvegarde terminée sur srv-bkp-01"}'
```

## Clients

```powershell
winget install --id RocketChat.RocketChat -e
```

```bash
brew install --cask rocket-chat
```

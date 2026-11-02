---
title: Matrix — aide-mémoire des commandes
description: Commandes et API Matrix — Synapse (service, journaux, register_new_matrix_user, synapse_port_db pour passer de SQLite à PostgreSQL, API admin : utilisateurs, salons, purge d'historique, médias, version de serveur), tests de fédération (/.well-known, federation tester), Element Web (config.json), ESS (helm), Dendrite et Continuwuity (journaux, commandes d'administration dans le salon admin) avec exemples.
tags: [aide-mémoire, matrix, synapse, element, dendrite, continuwuity]
icon: terminal
---

Explications : [[01-synapse-ess|Synapse et ESS]] · [[02-dendrite-conduit-continuwuity|Dendrite, Conduit et Continuwuity]] · [[03-interface-graphique|Element]].

```bash
sudo systemctl status matrix-synapse ; sudo journalctl -u matrix-synapse -f
register_new_matrix_user -c /etc/matrix-synapse/homeserver.yaml -u jk -a http://localhost:8008
synapse_port_db --sqlite-database homeserver.db --postgres-config homeserver-postgres.yaml
T="Authorization: Bearer $JETON_ADMIN" ; S=https://matrix.corp.exemple.fr
curl -s -H "$T" "$S/_synapse/admin/v2/users?limit=10" | jq '.users[].name' ; curl -s -H "$T" "$S/_synapse/admin/v1/server_version"
curl -s -H "$T" -X POST "$S/_synapse/admin/v1/deactivate/@ancien:corp.exemple.fr" -d '{"erase": false}'
curl -s -H "$T" "$S/_synapse/admin/v1/rooms?limit=10" | jq '.rooms[] | {name, joined_members}'
curl -s https://corp.exemple.fr/.well-known/matrix/server ; curl -s https://corp.exemple.fr/.well-known/matrix/client
helm -n ess list ; kubectl -n ess get pods ; docker logs -f continuwuity
```

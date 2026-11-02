---
title: Bases documentaires — aide-mémoire des commandes
description: Commandes FerretDB (mongosh, ferretdb --version, journaux), Couchbase (couchbase-cli cluster-init, server-list, bucket-list, bucket-create, user-manage, rebalance, cbq, cbstats), RavenDB (rvn admin-channel, service, Docker) et RethinkDB (rethinkdb dump, restore, export, import, index-rebuild) avec exemples.
tags: [aide-mémoire, ferretdb, couchbase, ravendb, rethinkdb]
icon: terminal
---

Explications : [[01-ferretdb|FerretDB]] · [[02-couchbase|Couchbase]] · [[03-ravendb|RavenDB]] · [[04-rethinkdb|RethinkDB]].

```bash
mongosh "mongodb://ferret:$MDP@localhost:27017/" --eval 'db.adminCommand({listDatabases: 1})' ; docker compose logs -f ferretdb
couchbase-cli server-list -c localhost -u Administrator -p "$MDP" ; couchbase-cli bucket-list -c localhost -u Administrator -p "$MDP"
couchbase-cli user-manage -c localhost -u Administrator -p "$MDP" --set --rbac-username app --rbac-password "$MDP_APP" --roles 'data_reader[inventaire]' --auth-domain local
cbq -e http://localhost:8093 -u Administrator -p "$MDP" -s 'SELECT COUNT(*) FROM inventaire'
/opt/couchbase/bin/cbstats localhost:11210 all -u Administrator -p "$MDP" -b inventaire | head
sudo systemctl status ravendb ; sudo rvn admin-channel
rethinkdb dump -c localhost:28015 -p ; rethinkdb restore sauvegarde.tar.gz -p ; rethinkdb export -e base.table --format csv --fields id,nom -p ; rethinkdb index-rebuild -p
```

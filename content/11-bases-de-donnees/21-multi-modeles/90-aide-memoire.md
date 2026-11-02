---
title: SurrealDB, ArangoDB et OrientDB — aide-mémoire des commandes
description: Commandes SurrealDB (surreal start, sql, export, import, isready, version, upgrade), ArangoDB (arangod, arangosh, arangodump, arangorestore, arangoimport, arangoexport, arangobench, arangodb starter) et OrientDB (server.sh, shutdown.sh, console.sh : CONNECT, LIST DATABASES, BACKUP, RESTORE, EXPORT, IMPORT) avec exemples.
tags: [aide-mémoire, surrealdb, arangodb, orientdb]
icon: terminal
---

Explications : [[01-surrealdb|SurrealDB]] · [[02-arangodb|ArangoDB]] · [[03-orientdb|OrientDB]].

```bash
surreal version ; surreal isready --endpoint http://127.0.0.1:8000 ; surreal upgrade
surreal start --user root --pass "$MDP" surrealkv:/srv/surreal ; surreal sql -e http://127.0.0.1:8000 -u root -p "$MDP" --ns corp --db inventaire
surreal export -e http://127.0.0.1:8000 -u root -p "$MDP" --ns corp --db inventaire sauv.surql ; surreal import … sauv.surql
arangosh --server.username root --javascript.execute-string 'print(db._databases())'
arangodump --server.database inventaire --output-directory /sauv/arango ; arangorestore --input-directory /sauv/arango --server.database inventaire
arangoimport --file f.jsonl --type jsonl --collection equipements ; arangoexport --type csv --collection equipements --fields nom,site
sudo systemctl status arangodb3
/opt/orientdb/bin/server.sh ; /opt/orientdb/bin/shutdown.sh ; /opt/orientdb/bin/console.sh "CONNECT remote:localhost root $MDP; LIST DATABASES"
```

---
title: TerminusDB et XTDB — aide-mémoire des commandes
description: Commandes TerminusDB (terminusdb db create/delete/list, branch create, log, reset, push, pull, clone, doc get/insert, serve, store init) et XTDB (psql, FOR VALID_TIME AS OF, FOR SYSTEM_TIME AS OF, FOR ALL VALID_TIME, ERASE, santé HTTP) avec exemples.
tags: [aide-mémoire, terminusdb, xtdb]
icon: terminal
---

Explications : [[01-presentation-installation|TerminusDB et XTDB]].

```bash
terminusdb db list ; terminusdb db create admin/cmdb ; terminusdb db delete admin/test
terminusdb branch create admin/cmdb/local/branch/test ; terminusdb log admin/cmdb ; terminusdb reset admin/cmdb/local/branch/main <commit>
terminusdb doc get admin/cmdb ; terminusdb doc insert admin/cmdb -g schema < schema.json
terminusdb clone http://autre:6363/admin/cmdb ; terminusdb push admin/cmdb ; terminusdb pull admin/cmdb
psql -h localhost -p 5432 -U xtdb xtdb -c "SELECT * FROM equipements FOR SYSTEM_TIME AS OF TIMESTAMP '2026-01-01 00:00:00'"
psql -h localhost -p 5432 -U xtdb xtdb -c "ERASE FROM equipements WHERE _id = 'sw1'"   # effacement définitif (RGPD)
curl -s http://localhost:8080/healthz/alive
```

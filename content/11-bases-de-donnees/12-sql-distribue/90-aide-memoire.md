---
title: CockroachDB, YugabyteDB et TiDB — aide-mémoire des commandes
description: Commandes CockroachDB (start, init, node status, node decommission, sql, cert, debug zip, SHOW RANGES, BACKUP), YugabyteDB (yugabyted start/stop/status/configure/collect_logs, ysqlsh, ycqlsh, yb-admin) et TiDB (tiup cluster deploy/start/stop/display/scale-out/scale-in/upgrade/reload/edit-config, tiup br, tiup ctl pd) avec exemples.
tags: [aide-mémoire, cockroachdb, yugabytedb, tidb, tiup]
icon: terminal
---

Explications : [[01-cockroachdb|CockroachDB]] · [[02-yugabytedb|YugabyteDB]] · [[03-tidb|TiDB]].

## CockroachDB

```bash
cockroach version ; cockroach node status --certs-dir=certs --host=db1 ; cockroach node decommission 4 --certs-dir=certs --host=db1
cockroach sql --certs-dir=certs --host=db1 -e "SHOW DATABASES;" ; cockroach debug zip ./diag.zip --certs-dir=certs --host=db1
cockroach cert list --certs-dir=certs
```

## YugabyteDB

```bash
./bin/yugabyted status ; ./bin/yugabyted stop ; ./bin/yugabyted collect_logs
./bin/ysqlsh -h 10.0.20.61 -c '\l' ; ./bin/ycqlsh 10.0.20.61 -e 'DESCRIBE KEYSPACES'
./bin/yb-admin -master_addresses 10.0.20.61:7100,10.0.20.62:7100,10.0.20.63:7100 list_all_tablet_servers
```

## TiDB

```bash
tiup cluster list ; tiup cluster display tidb-prod ; tiup cluster stop tidb-prod ; tiup cluster start tidb-prod
tiup cluster edit-config tidb-prod ; tiup cluster reload tidb-prod -R tidb
tiup cluster scale-out tidb-prod ajout.yaml ; tiup cluster scale-in tidb-prod --node 10.0.20.83:20160
tiup cluster upgrade tidb-prod v8.5.1 ; tiup br backup full --pd 10.0.20.71:2379 --storage "local:///sauv/full"
tiup ctl:v8.5.0 pd -u http://10.0.20.71:2379 store
```

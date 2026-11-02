---
title: FoundationDB — aide-mémoire des commandes
description: Commandes fdbcli (status, status details, status json, configure, coordinators, exclude, include, kill, maintenance, writemode, get, set, getrange, clear, lock, unlock) et fdbbackup/fdbrestore avec exemples.
tags: [aide-mémoire, foundationdb, fdbcli]
icon: terminal
---

Explications : [[01-presentation-installation|FoundationDB]].

```bash
fdbcli --exec "status" ; fdbcli --exec "status json" | jq '.cluster.data.state'
fdbcli -C /etc/foundationdb/fdb.cluster
```

```text
fdbcli> status details ; configure triple ; coordinators auto ; exclude 10.0.20.183:4500 ; include all
fdbcli> kill ; kill 10.0.20.183:4500           # redémarrer un processus
fdbcli> maintenance on <zone> 3600             # zone en maintenance sans redistribution
fdbcli> writemode on ; set cle valeur ; get cle ; getrange a z 10 ; clear cle
```

```bash
fdbbackup start -d file:///sauv/fdb -z ; fdbbackup status ; fdbbackup list -b file:///sauv/fdb ; fdbbackup discontinue
fdbrestore start -r file:///sauv/fdb/<dossier> ; fdbrestore status
```

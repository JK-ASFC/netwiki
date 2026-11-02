---
title: Cassandra et ScyllaDB — aide-mémoire des commandes
description: Commandes nodetool (status, info, ring, describecluster, tablestats, tablehistograms, compactionstats, repair, cleanup, flush, snapshot, listsnapshots, clearsnapshot, decommission, removenode, drain, gossipinfo, netstats), cqlsh (DESCRIBE, CONSISTENCY, TRACING, COPY, SOURCE) et sctool de Scylla Manager, avec exemples.
tags: [aide-mémoire, cassandra, scylladb, nodetool, cqlsh]
icon: terminal
---

Explications : [[01-cassandra|Cassandra]] · [[02-scylladb|ScyllaDB]].

```bash
nodetool status ; nodetool info ; nodetool describecluster ; nodetool ring | head ; nodetool gossipinfo | head
nodetool tablestats ks.table ; nodetool tablehistograms ks table ; nodetool compactionstats ; nodetool netstats
nodetool repair -pr ks ; nodetool cleanup ks ; nodetool flush ks ; nodetool snapshot -t nom ks ; nodetool listsnapshots ; nodetool clearsnapshot -t nom
nodetool decommission ; nodetool removenode <host-id> ; nodetool drain
cqlsh hote -u admin_cql -p "$MDP" -e "DESCRIBE KEYSPACES"
cqlsh> DESCRIBE TABLE supervision.evenements; CONSISTENCY LOCAL_QUORUM; TRACING ON; SOURCE 'schema.cql';
cqlsh> COPY supervision.evenements TO '/tmp/evenements.csv' WITH HEADER = true;
sctool status -c prod ; sctool repair -c prod ; sctool backup -c prod -L s3:sauvegardes-scylla ; sctool tasks -c prod
```

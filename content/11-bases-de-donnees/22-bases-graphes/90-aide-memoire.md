---
title: Memgraph, JanusGraph et Dgraph — aide-mémoire des commandes
description: Commandes Memgraph (mgconsole, SHOW STORAGE INFO, SHOW INDEX INFO, CREATE INDEX, CREATE SNAPSHOT, SHOW USERS, procédures MAGE), JanusGraph (janusgraph-server.sh, gremlin.sh, :remote, management API : printSchema, buildIndex, reindex) et Dgraph (zero, alpha, increment, live, bulk, /health, /state, export) avec exemples.
tags: [aide-mémoire, memgraph, janusgraph, dgraph, cypher, gremlin]
icon: terminal
---

Explications : [[01-memgraph|Memgraph]] · [[02-janusgraph|JanusGraph]] · [[03-dgraph|Dgraph]].

## Memgraph

```text
SHOW STORAGE INFO; SHOW INDEX INFO; SHOW USERS; CREATE INDEX ON :Equipement(nom); CREATE SNAPSHOT;
CALL mg.procedures() YIELD name RETURN name LIMIT 20;
```

```bash
mgconsole --host 127.0.0.1 --username admin --password "$MDP" < script.cypherl ; sudo journalctl -u memgraph -f
```

## JanusGraph

```bash
bin/janusgraph-server.sh start|stop|status ; bin/gremlin.sh
```

```text
gremlin> graph = JanusGraphFactory.open('conf/janusgraph-cql-es.properties'); mgmt = graph.openManagement(); mgmt.printSchema()
gremlin> mgmt.buildIndex('parNom', Vertex.class).addKey(mgmt.getPropertyKey('nom')).buildCompositeIndex(); mgmt.commit()
gremlin> g.V().count() ; g.E().count()
```

## Dgraph

```bash
curl -s localhost:8080/health | jq . ; curl -s localhost:6080/state | jq '.groups | keys'
dgraph increment --alpha localhost:9080 ; dgraph live -f donnees.rdf.gz -s schema.txt --alpha localhost:9080 --zero localhost:5080
```

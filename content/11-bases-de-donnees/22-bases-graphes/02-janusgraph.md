---
title: JanusGraph
description: JanusGraph — base de graphes distribuée (Linux Foundation, Apache 2.0) au-dessus d'un stockage (Cassandra, ScyllaDB, HBase, BerkeleyDB) et d'un index (Elasticsearch, OpenSearch, Solr, Lucene) : architecture, installation (archive, Docker), configuration janusgraph.properties, JanusGraph Server (Gremlin Server, port 8182), console Gremlin, schéma (propriétés, labels, index composites et mixtes), requêtes Gremlin, et exploitation (sauvegarde via le stockage, réindexation).
tags: [janusgraph, gremlin, tinkerpop, graphe, cassandra, elasticsearch]
icon: info
---

**JanusGraph** est une couche **graphe** (API Apache TinkerPop, langage **Gremlin**) posée sur un stockage distribué existant — typiquement [[15-cassandra-scylladb/01-cassandra|Cassandra ou ScyllaDB]] — et un index de recherche ([[01-elasticsearch/01-presentation-installation|Elasticsearch]] ou OpenSearch). Il vise les très grands graphes (milliards d'arêtes).

## Installation

```bash
sudo apt install openjdk-11-jre-headless unzip      # Java 8 ou 11 selon la version de JanusGraph
unzip janusgraph-1.*.zip -d /opt && sudo ln -sfn /opt/janusgraph-1.* /opt/janusgraph
docker run -d --name janusgraph -p 8182:8182 janusgraph/janusgraph:latest   # BerkeleyDB + Lucene (test)
```

```ini
# conf/janusgraph-cql-es.properties — production
storage.backend=cql
storage.hostname=10.0.20.101,10.0.20.102,10.0.20.103
storage.cql.keyspace=janusgraph
storage.cql.local-datacenter=paris
index.search.backend=elasticsearch
index.search.hostname=10.0.20.201
cache.db-cache=true
```

```bash
cd /opt/janusgraph && bin/janusgraph-server.sh start conf/janusgraph-server.yaml    # Gremlin Server sur 8182
bin/gremlin.sh                                                                      # console
```

```text
gremlin> :remote connect tinkerpop.server conf/remote.yaml session
gremlin> :remote console
gremlin> g.addV('equipement').property('nom','sw-acces-01').as('a').addV('equipement').property('nom','sw-coeur-01').as('c').addE('uplink').from('a').to('c')
gremlin> g.V().has('equipement','nom','sw-coeur-01').in('uplink').values('nom')
```

Définir le **schéma** et les **index** avant de charger les données (`mgmt = graph.openManagement()`, `buildIndex(...)`) : un parcours sans index sur un grand graphe parcourt tout le stockage. Sauvegarde : celle du stockage et de l'index sous-jacents.

Suite : [[03-dgraph|Dgraph]] · [[90-aide-memoire|aide-mémoire]].

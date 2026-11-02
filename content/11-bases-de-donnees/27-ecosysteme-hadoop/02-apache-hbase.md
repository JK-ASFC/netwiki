---
title: Apache HBase
description: Apache HBase — base NoSQL orientée colonnes sur HDFS, modèle de Bigtable : architecture (HMaster, RegionServers, régions, ZooKeeper, HDFS), installation (mode autonome pour test, cluster sur Hadoop, Docker), hbase-site.xml, shell HBase (create, put, get, scan, disable, drop, status), clés de ligne et familles de colonnes, compaction et découpage de régions, interfaces web (16010, 16030), instantanés, réplication, sauvegarde et alternatives.
tags: [apache hbase, hadoop, nosql, hdfs, bigtable, zookeeper]
icon: info
---

**HBase** offre des lectures et écritures aléatoires rapides sur des tables de milliards de lignes stockées dans **HDFS**. On le trouve dans les plates-formes Hadoop historiques (télécoms, IoT, compteurs), souvent derrière des applications plutôt qu'interrogé à la main. Pour un nouveau projet hors Hadoop, [[15-cassandra-scylladb/01-cassandra|Cassandra]] est souvent plus simple à exploiter.

## Installation (test autonome)

```bash
tar xzf hbase-2.*-bin.tar.gz -C /opt && cd /opt/hbase-2.*
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
bin/start-hbase.sh            # mode autonome : ZooKeeper et stockage local intégrés
bin/hbase shell
```

En cluster : `conf/hbase-site.xml` avec `hbase.rootdir=hdfs://nn:8020/hbase`, `hbase.cluster.distributed=true`, `hbase.zookeeper.quorum=zk1,zk2,zk3` ; fichier `conf/regionservers`. Interfaces : HMaster `http://<master>:16010`, RegionServer `:16030`.

```text
hbase> create 'mesures', {NAME => 'm', VERSIONS => 3, TTL => 7776000, COMPRESSION => 'SNAPPY'}
hbase> put 'mesures', 'sw-coeur-01#20261102T1000', 'm:cpu', '42'
hbase> get 'mesures', 'sw-coeur-01#20261102T1000'
hbase> scan 'mesures', {ROWPREFIXFILTER => 'sw-coeur-01#202611', LIMIT => 10}
hbase> status 'detailed'
hbase> snapshot 'mesures', 'mesures-2026-11-02'
```

La **clé de ligne** détermine la répartition : préfixer par l'équipement (ou un sel) évite qu'une seule région reçoive toutes les écritures récentes.

Suite : [[03-apache-kudu|Kudu]] · [[90-aide-memoire|aide-mémoire]].

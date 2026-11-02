---
title: Apache Hive
description: Apache Hive — entrepôt de données SQL sur Hadoop (HDFS ou stockage objet) : rôle actuel (Hive Metastore comme catalogue partagé par Spark, Trino, Impala), versions 3 et 4, composants (HiveServer2, Metastore, moteur Tez), installation (archives, Docker apache/hive, distributions), configuration hive-site.xml (base du Metastore PostgreSQL ou MySQL), schematool, beeline, tables gérées et externes, partitions, formats ORC et Parquet, tables ACID et Iceberg, sécurité (Kerberos, Ranger).
tags: [apache hive, hadoop, metastore, entrepôt de données, beeline, sql]
icon: info
---

**Hive** a popularisé le SQL sur Hadoop. Aujourd'hui, son composant le plus utilisé est le **Hive Metastore** : le **catalogue** (bases, tables, partitions, emplacements des fichiers) partagé par Spark, [[26-moteurs-sql-federes/01-trino-presto|Trino]] et Impala, même sans exécuter de requêtes Hive.

| Composant | Rôle | Port |
| --- | --- | --- |
| **Metastore** | Catalogue des tables (base PostgreSQL/MySQL derrière) | 9083 (Thrift) |
| **HiveServer2** | Point d'entrée SQL (JDBC/ODBC) | 10000, interface 10002 |
| Moteur | Tez (MapReduce historique) | — |

## Metastore seul (cas le plus fréquent)

```bash
docker run -d --name metastore -p 9083:9083 -e SERVICE_NAME=metastore -e DB_DRIVER=postgres \
  -e SERVICE_OPTS="-Djavax.jdo.option.ConnectionURL=jdbc:postgresql://srv-db-01:5432/metastore -Djavax.jdo.option.ConnectionUserName=hive -Djavax.jdo.option.ConnectionPassword=MdpHive2026" \
  apache/hive:4.0.1
```

Installation manuelle : archive Hive + Hadoop (bibliothèques client), `hive-site.xml` (`javax.jdo.option.*`, `hive.metastore.warehouse.dir` vers HDFS ou `s3a://`), initialisation du schéma :

```bash
$HIVE_HOME/bin/schematool -dbType postgres -initSchema
$HIVE_HOME/bin/hive --service metastore &
$HIVE_HOME/bin/hiveserver2 &
beeline -u jdbc:hive2://srv-hive:10000/default -n jk
```

```sql
CREATE EXTERNAL TABLE journaux (ts TIMESTAMP, equipement STRING, message STRING)
PARTITIONED BY (jour STRING) STORED AS PARQUET LOCATION 's3a://lac/journaux/';
MSCK REPAIR TABLE journaux;        -- découvrir les partitions présentes dans le stockage
SELECT equipement, count(*) FROM journaux WHERE jour = '2026-11-01' GROUP BY equipement;
```

Sécurité en production : Kerberos ([[04-kerberos/01-presentation-installation|Kerberos]]), autorisations Apache Ranger, TLS sur HiveServer2.

Suite : [[02-apache-hbase|HBase]] · [[03-apache-kudu|Kudu]] · [[90-aide-memoire|aide-mémoire]].

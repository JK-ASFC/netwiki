---
title: Apache Flink
description: Apache Flink, moteur de traitement de flux avec état — temps d'événement et filigranes, fenêtres, état et points de contrôle (checkpoints, savepoints), exactement une fois, architecture JobManager/TaskManager, installation, flink run, Flink SQL (sql-client), connecteurs Kafka, opérateur Kubernetes, interface web 8081, haute disponibilité et réglages.
tags: [apache flink, flink, streaming, traitement de flux, flink sql, kafka, kubernetes]
icon: workflow
---

**Apache Flink** traite des **flux** d'événements en continu, avec une faible latence et un **état** durable (compteurs, agrégats, jointures). Il gère aussi les lots comme des flux bornés. Usages : détection de fraude, tableaux de bord temps réel, ETL en continu depuis Kafka ou une capture de changements.

## Notions clés

| Notion | Explication |
| --- | --- |
| Temps d'événement | L'heure portée par l'événement, et non l'heure de traitement |
| **Filigrane** (*watermark*) | Indique jusqu'où les événements sont arrivés ; gère les retards |
| Fenêtres | Fixes (*tumbling*), glissantes, de session |
| État | Clé-valeur par clé, stocké en mémoire ou dans **RocksDB** |
| **Checkpoint** | Instantané automatique et cohérent de l'état (stockage S3, HDFS) |
| **Savepoint** | Instantané manuel pour mise à jour, migration ou changement de parallélisme |
| Exactement une fois | Garantie de bout en bout avec des sources et puits transactionnels (Kafka) |

## Architecture et installation

- **JobManager** : planifie et coordonne (interface web et API REST sur **8081**).
- **TaskManagers** : exécutent les tâches dans des *slots*.

```bash
# Java 11 ou 17 ; archive depuis flink.apache.org
tar xzf flink-*-bin-scala_2.12.tgz -C /opt && ln -s /opt/flink-* /opt/flink
/opt/flink/bin/start-cluster.sh                 # grappe locale de test
/opt/flink/bin/flink run -p 4 -d mon-traitement.jar
/opt/flink/bin/flink list
/opt/flink/bin/flink savepoint <job-id> s3://flink/savepoints
/opt/flink/bin/flink stop --savepointPath s3://flink/savepoints <job-id>
/opt/flink/bin/flink run -s s3://flink/savepoints/savepoint-xxxx -d mon-traitement-v2.jar
```

```yaml conf/config.yaml
jobmanager.memory.process.size: 2g
taskmanager.memory.process.size: 8g
taskmanager.numberOfTaskSlots: 4
state.backend.type: rocksdb
execution.checkpointing.interval: 60s
state.checkpoints.dir: s3://flink/checkpoints
high-availability.type: kubernetes
high-availability.storageDir: s3://flink/ha
```

Sur **Kubernetes**, l'**opérateur Flink Kubernetes** gère les ressources `FlinkDeployment` (déploiement, mise à jour avec savepoint, redémarrage).

## Flink SQL

```sql
CREATE TABLE commandes (
  id BIGINT, client STRING, montant DECIMAL(10,2), ts TIMESTAMP(3),
  WATERMARK FOR ts AS ts - INTERVAL '10' SECOND
) WITH ('connector' = 'kafka', 'topic' = 'commandes',
        'properties.bootstrap.servers' = 'kafka:9092', 'format' = 'json',
        'scan.startup.mode' = 'latest-offset');

SELECT window_start, client, SUM(montant) AS total
FROM TABLE(TUMBLE(TABLE commandes, DESCRIPTOR(ts), INTERVAL '5' MINUTES))
GROUP BY window_start, window_end, client;
```

```bash
/opt/flink/bin/sql-client.sh
```

Les connecteurs (Kafka, JDBC, fichiers, Iceberg…) sont des fichiers JAR à placer dans `lib/` ou à embarquer dans l'application.

## Exploitation

- Suivre dans l'interface 8081 : **contre-pression** (*backpressure*), durée et taille des checkpoints, retard des filigranes.
- Prévoir un **savepoint avant toute mise à jour** de code ou de version de Flink.
- Métriques vers Prometheus (`metrics.reporter.prom.factory.class`).

Voir aussi : [[01-apache-spark|Apache Spark]] · [[03-beam-samza-storm|Beam, Samza et Storm]] · [[03-cdc-connecteurs/02-benthos-flink-cdc|Flink CDC]]. Commandes : [[90-aide-memoire|aide-mémoire]].

---
title: Apache Druid
description: Apache Druid — base analytique temps réel pour séries d'événements (Apache 2.0) : architecture (Coordinator, Overlord, Broker, Router, Historical, MiddleManager/Indexer, stockage profond, métadonnées, ZooKeeper), installation (archive avec configurations single-server, Docker Compose, Helm), console web (port 8888), ingestion (Kafka, fichiers, S3) avec spécifications ou SQL (MSQ), rollup, granularité, rétention, requêtes Druid SQL, supervision.
tags: [apache druid, olap, temps réel, séries d'événements, kafka, rollup]
icon: info
---

**Apache Druid** ingère des flux d'événements (clics, journaux réseau, métriques) et répond en sous-seconde à des requêtes de filtrage et d'agrégation dans le temps. Le **rollup** pré-agrège à l'ingestion pour réduire fortement le volume.

## Installation

```bash
# Archive (Java 17) depuis druid.apache.org
tar xzf apache-druid-*-bin.tar.gz -C /opt && cd /opt/apache-druid-*
bin/start-druid                         # démarrage tout-en-un dimensionné automatiquement (test ou petite production)
# Console : http://<hôte>:8888
```

Production : services répartis sur plusieurs machines, **stockage profond** S3/MinIO ou HDFS, base de métadonnées PostgreSQL ou MySQL, ZooKeeper ; Helm sur Kubernetes. Linux et macOS (Windows via Docker).

## Ingestion SQL (MSQ) et requêtes

```sql
-- Depuis la console (onglet Query) : ingestion par lots depuis un fichier S3
REPLACE INTO "flux" OVERWRITE ALL
SELECT TIME_PARSE("ts") AS __time, "equipement", "dst", "octets"
FROM TABLE(EXTERN('{"type":"s3","uris":["s3://journaux/netflow-2026-11-01.json"]}', '{"type":"json"}',
  '[{"name":"ts","type":"string"},{"name":"equipement","type":"string"},{"name":"dst","type":"string"},{"name":"octets","type":"long"}]'))
PARTITIONED BY DAY;

SELECT equipement, SUM(octets) AS volume FROM flux WHERE __time > CURRENT_TIMESTAMP - INTERVAL '1' HOUR GROUP BY 1 ORDER BY 2 DESC LIMIT 10;
```

Ingestion continue : *supervisor* Kafka créé depuis la console (*Load data → Apache Kafka*). Rétention : règles du Coordinator (`loadByPeriod`, `dropForever`).

Interface : [[04-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].

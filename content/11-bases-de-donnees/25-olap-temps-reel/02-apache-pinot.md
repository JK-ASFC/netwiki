---
title: Apache Pinot
description: Apache Pinot — base OLAP temps réel orientée requêtes utilisateur à très faible latence (LinkedIn, Uber) : composants (Controller, Broker, Server, Minion, ZooKeeper), installation (archive, Docker, Helm), ports (9000 console, 8099 broker), schéma et configuration de table (OFFLINE, REALTIME), ingestion depuis Kafka et fichiers (jobs d'ingestion par lots), index (inverted, range, star-tree), requêtes SQL et multi-étapes, administration avec pinot-admin.sh.
tags: [apache pinot, olap, temps réel, kafka, faible latence]
icon: info
---

**Apache Pinot** sert des requêtes analytiques en **millisecondes** à de très nombreux utilisateurs simultanés (tableaux de bord exposés aux clients, statistiques en direct), en ingérant directement des flux Kafka.

| Composant | Rôle |
| --- | --- |
| **Controller** | Gestion du cluster, console web (port **9000**) |
| **Broker** | Reçoit et répartit les requêtes (port **8099**) |
| **Server** | Stocke les segments et exécute |
| Minion | Tâches de fond (fusion, purge) |
| ZooKeeper | Coordination |

## Installation (démonstration)

```bash
docker run -d --name pinot -p 9000:9000 -p 8099:8099 apachepinot/pinot:latest QuickStart -type hybrid
# Production : Helm (pinot/pinot) ou archive : bin/pinot-admin.sh StartZookeeper / StartController / StartBroker / StartServer
```

Java 11+ ; Linux et macOS (Windows via Docker).

## Table temps réel depuis Kafka

```bash
bin/pinot-admin.sh AddTable -schemaFile flux-schema.json -tableConfigFile flux-realtime.json -controllerHost 10.0.20.231 -exec
```

```json
{
  "tableName": "flux",
  "tableType": "REALTIME",
  "segmentsConfig": { "timeColumnName": "ts", "replication": "2", "retentionTimeUnit": "DAYS", "retentionTimeValue": "30" },
  "tableIndexConfig": {
    "invertedIndexColumns": ["equipement"],
    "streamConfigs": {
      "streamType": "kafka",
      "stream.kafka.topic.name": "netflow",
      "stream.kafka.broker.list": "10.0.20.221:9092",
      "stream.kafka.consumer.type": "lowlevel",
      "stream.kafka.decoder.class.name": "org.apache.pinot.plugin.stream.kafka.KafkaJSONMessageDecoder"
    }
  },
  "tenants": {},
  "metadata": {}
}
```

```bash
curl -s -X POST http://10.0.20.232:8099/query/sql -H 'Content-Type: application/json' \
  -d '{"sql":"SELECT equipement, sum(octets) FROM flux WHERE ts > ago('PT1H') GROUP BY equipement ORDER BY 2 DESC LIMIT 10"}'
```

Suite : [[03-apache-druid|Druid]] · [[90-aide-memoire|aide-mémoire]].

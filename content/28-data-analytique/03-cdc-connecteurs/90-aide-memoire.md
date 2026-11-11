---
title: Debezium, Kafka Connect, Redpanda Connect et Flink CDC — aide-mémoire
description: API REST de Kafka Connect (connecteurs, état, redémarrage, pause), prérequis Debezium PostgreSQL et MySQL, surveillance des slots de réplication, commandes rpk connect et flink-cdc.sh.
tags: [aide-mémoire, debezium, kafka connect, redpanda connect, benthos, flink cdc, cdc]
icon: terminal
---

Explications : [[01-debezium-kafka-connect|Debezium et Kafka Connect]] · [[02-benthos-flink-cdc|Redpanda Connect et Flink CDC]].

| Outil | Port |
| --- | --- |
| Kafka Connect | 8083 API REST |
| Redpanda Connect / Benthos | 4195 HTTP (santé, métriques) |
| Flink | 8081 interface du JobManager |

```bash
# Kafka Connect
curl -s localhost:8083/connectors?expand=status | jq
curl -X PUT -H 'Content-Type: application/json' localhost:8083/connectors/NOM/config -d @NOM.json
curl -X POST "localhost:8083/connectors/NOM/restart?includeTasks=true"
curl -X PUT localhost:8083/connectors/NOM/pause ; curl -X PUT localhost:8083/connectors/NOM/resume
curl -X DELETE localhost:8083/connectors/NOM

# Redpanda Connect
rpk connect lint connect.yaml ; rpk connect run connect.yaml

# Flink CDC
bash bin/flink-cdc.sh pipeline.yaml
```

```sql
-- PostgreSQL : prérequis et surveillance
SHOW wal_level;
SELECT slot_name, active, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retard
  FROM pg_replication_slots;
SELECT pg_drop_replication_slot('slot_orphelin');

-- MySQL : prérequis
SHOW VARIABLES WHERE Variable_name IN ('binlog_format', 'binlog_row_image', 'gtid_mode');
```

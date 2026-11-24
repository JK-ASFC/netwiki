---
title: Connecteurs, CDC et traitement de flux — aide-mémoire
description: Commandes Kafka Connect (API REST des connecteurs sur 8083 : create, list, status, config, restart, pause, resume, delete, connector-plugins), Debezium (connecteurs source PostgreSQL/MySQL/MongoDB, prérequis WAL/binlog, slot de réplication) et Redpanda Connect / Benthos (lint, run, list, streams, blobl server, test) avec exemples.
tags: [aide-mémoire, kafka connect, debezium, redpanda connect, benthos, cdc]
icon: terminal
---

Explications : [[01-kafka-connect-debezium|Kafka Connect et Debezium]] · [[02-redpanda-connect-benthos|Redpanda Connect (Benthos)]].

## Kafka Connect (API REST, port 8083)

```bash
connect-distributed /etc/kafka/connect-distributed.properties          # démarrer un worker distribué
curl -s localhost:8083/connectors | jq .
curl -s -X POST localhost:8083/connectors -H 'Content-Type: application/json' -d @connecteur.json
curl -s localhost:8083/connectors/NOM/status | jq '.connector.state,.tasks[].state'
curl -s -X PUT  localhost:8083/connectors/NOM/config -H 'Content-Type: application/json' -d @config.json
curl -s -X POST localhost:8083/connectors/NOM/restart ; curl -s -X PUT localhost:8083/connectors/NOM/pause
curl -s -X PUT  localhost:8083/connectors/NOM/resume ; curl -s -X DELETE localhost:8083/connectors/NOM
curl -s localhost:8083/connector-plugins | jq '.[].class'              # greffons installés
```

## Debezium (prérequis bases)

```sql
-- PostgreSQL : wal_level=logical, rôle REPLICATION, surveiller le slot
SELECT slot_name, active, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retard
FROM pg_replication_slots;
```

```sql
-- MySQL/MariaDB : binlog au format ROW
SET GLOBAL binlog_format = 'ROW'; SHOW VARIABLES LIKE 'binlog_row_image'; SHOW BINARY LOGS;
```

## Redpanda Connect (Benthos)

```bash
redpanda-connect lint pipeline.yaml ; redpanda-connect run pipeline.yaml
rpk connect run pipeline.yaml                                          # via rpk
redpanda-connect list inputs ; redpanda-connect list processors ; redpanda-connect list outputs
redpanda-connect blobl server                                         # éditeur Bloblang interactif
redpanda-connect streams ./pipelines/*.yaml                           # multi-pipelines + API de gestion
redpanda-connect test ./pipeline_test.yaml                            # tests en CI
```

---
title: Kafka Connect et Debezium
description: Kafka Connect — cadriciel d'intégration de données de l'écosystème Kafka (connecteurs source et sink, workers standalone et distribués, convertisseurs JSON/Avro/Protobuf avec Schema Registry, Single Message Transforms, API REST 8083, gestion des offsets et des erreurs, dead letter queue) ; Debezium — capture de changements (CDC) depuis le journal de transactions de PostgreSQL, MySQL/MariaDB, MongoDB, SQL Server et Oracle vers Kafka (snapshots, streaming, format d'événement, Debezium Server sans Kafka vers Pulsar/Kinesis/Redis). Installation, configuration, API REST et exploitation.
tags: [kafka connect, debezium, cdc, etl, connecteurs, kafka, schema registry]
icon: workflow
---

**Kafka Connect** déplace des données **entre [[04-kafka/01-presentation-installation|Kafka]] et le reste du système** (bases, S3, Elasticsearch, files) sans écrire de code : on déclare des **connecteurs** source (vers Kafka) ou sink (depuis Kafka). **Debezium** est l'ensemble de connecteurs source de **capture de changements** (CDC) : il lit le **journal de transactions** d'une base et publie chaque INSERT/UPDATE/DELETE comme un événement Kafka — idéal pour répliquer, alimenter un cache, un moteur de recherche ou un entrepôt en temps réel.

## Kafka Connect

```bash
# Mode distribué (recommandé) : plusieurs workers partagent la charge et tolèrent les pannes
# /etc/kafka/connect-distributed.properties
#   bootstrap.servers=broker1:9092,broker2:9092
#   group.id=connect-cluster
#   key.converter=org.apache.kafka.connect.json.JsonConverter
#   value.converter=org.apache.kafka.connect.json.JsonConverter
#   offset.storage.topic=connect-offsets  (+ config.storage.topic, status.storage.topic ; replication.factor=3)
#   plugin.path=/opt/kafka/connectors
connect-distributed /etc/kafka/connect-distributed.properties      # API REST sur :8083
```

| Notion | Rôle |
| --- | --- |
| **Connecteur** | Définition d'une intégration (classe + configuration) ; source ou sink |
| **Tâche** (*task*) | Unité de parallélisme d'un connecteur, répartie sur les workers |
| **Convertisseur** | Sérialisation : JSON, **Avro**/**Protobuf**/**JSON Schema** avec un *Schema Registry* |
| **SMT** (*Single Message Transform*) | Transformations légères par message (renommer, router, masquer, extraire une clé) |
| **DLQ** | *Dead letter queue* : topic où sont envoyés les messages en erreur |

Connecteurs courants : **JDBC** (bases SQL), **S3**/**GCS** (sink objet), **Elasticsearch**, **HTTP**, **MongoDB**, **Debezium** (CDC). Ils s'installent dans `plugin.path` (archives Confluent Hub ou JAR).

### API REST

```bash
# Créer / mettre à jour un connecteur
curl -s -X POST http://localhost:8083/connectors -H 'Content-Type: application/json' -d '{
  "name": "sink-s3-evenements",
  "config": {
    "connector.class": "io.confluent.connect.s3.S3SinkConnector",
    "tasks.max": "3",
    "topics": "evenements",
    "s3.bucket.name": "datalake",
    "store.url": "https://minio.corp.exemple.fr",
    "format.class": "io.confluent.connect.s3.format.json.JsonFormat",
    "flush.size": "10000"
  }
}'
curl -s http://localhost:8083/connectors | jq .
curl -s http://localhost:8083/connectors/sink-s3-evenements/status | jq '.connector.state, .tasks[].state'
curl -s -X PUT http://localhost:8083/connectors/sink-s3-evenements/config -H 'Content-Type: application/json' -d @config.json
curl -s -X POST http://localhost:8083/connectors/sink-s3-evenements/restart
curl -s -X PUT  http://localhost:8083/connectors/sink-s3-evenements/pause
curl -s -X DELETE http://localhost:8083/connectors/sink-s3-evenements
curl -s http://localhost:8083/connector-plugins | jq '.[].class'      # greffons disponibles
```

## Debezium (CDC)

Debezium s'exécute comme **connecteur source Kafka Connect**. Il fait d'abord un **snapshot** de l'état initial, puis **diffuse** les changements lus dans le journal de transactions (WAL de PostgreSQL, binlog de MySQL, oplog de MongoDB…).

```bash
# PostgreSQL : activer la réplication logique
#   postgresql.conf : wal_level = logical
#   rôle avec REPLICATION ; publication si plugin pgoutput
curl -s -X POST http://localhost:8083/connectors -H 'Content-Type: application/json' -d '{
  "name": "cdc-inventaire",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "10.0.20.30", "database.port": "5432",
    "database.user": "debezium", "database.password": "${file:/opt/secrets.properties:pg}",
    "database.dbname": "inventaire",
    "plugin.name": "pgoutput",
    "slot.name": "debezium_inventaire",
    "publication.autocreate.mode": "filtered",
    "table.include.list": "public.equipements,public.tickets",
    "topic.prefix": "inv",
    "tombstones.on.delete": "true"
  }
}'
# → topics : inv.public.equipements, inv.public.tickets
```

| Base | Source lue | Point d'attention |
| --- | --- | --- |
| **PostgreSQL** | WAL (réplication logique, `pgoutput`) | `wal_level=logical` ; surveiller le *replication slot* (rétention de WAL si le connecteur s'arrête) |
| **MySQL / MariaDB** | binlog (`ROW`) | `binlog_format=ROW`, `binlog_row_image=FULL`, droits `REPLICATION SLAVE` |
| **MongoDB** | *change streams* / oplog | Replica set requis |
| **SQL Server** | CDC natif | Activer le CDC sur la base et les tables |
| **Oracle** | LogMiner / XStream | Configuration la plus lourde |

Chaque événement contient l'**avant/après** (`before`/`after`), l'opération (`c`/`u`/`d`/`r`) et des métadonnées (LSN, horodatage). La SMT `ExtractNewRecordState` aplatit l'événement pour un sink classique.

**Debezium Server** : variante autonome (sans Kafka Connect) qui pousse les changements vers **Pulsar**, **Kinesis**, **Google Pub/Sub**, **Redis Streams**, **NATS** ou **HTTP** — utile quand on n'a pas de grappe Kafka.

## Exploitation

- **Supervision** : métriques JMX des workers et des connecteurs (retard, erreurs), exportées vers [[06-supervision/02-prometheus/01-presentation-installation|Prometheus]] (JMX Exporter).
- **Erreurs** : `errors.tolerance=all` + `errors.deadletterqueue.topic.name` pour ne pas bloquer sur un message incorrect.
- **Secrets** : `config.providers` (FileConfigProvider) pour ne pas écrire les mots de passe en clair dans la configuration.
- **Schémas** : avec Avro/Protobuf, un *Schema Registry* ([[09-nats-nsq-zeromq-redpanda/03-redpanda|Redpanda]] et Confluent en fournissent un) assure la compatibilité d'évolution.

Alternative sans Kafka pour router/transformer des flux : [[02-redpanda-connect-benthos|Redpanda Connect (Benthos)]]. Commandes : [[90-aide-memoire|aide-mémoire]].

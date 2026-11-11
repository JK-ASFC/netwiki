---
title: Debezium et Kafka Connect
description: Kafka Connect (workers distribués, topics internes config/offset/status, API REST 8083, connecteurs source et sink, convertisseurs JSON et Avro, transformations SMT, gestion des erreurs et file des lettres mortes) et Debezium (capture de changements depuis PostgreSQL, MySQL/MariaDB, SQL Server, Oracle, MongoDB : prérequis de chaque base, instantané initial, format des événements, Debezium Server et Debezium UI, signaux, supervision et pièges).
tags: [debezium, kafka connect, cdc, capture de changements, kafka, postgresql, mysql, réplication logique]
icon: git-compare
---

La **capture de changements** (*Change Data Capture*, CDC) lit le **journal de transactions** d'une base (WAL de PostgreSQL, binlog de MySQL) et publie chaque insertion, mise à jour ou suppression comme un événement, sans requêtes lourdes ni modification de l'application. **Debezium** fait cela au-dessus de **Kafka Connect**.

## Kafka Connect

Kafka Connect exécute des **connecteurs** : *source* (vers Kafka) ou *sink* (depuis Kafka vers une base, S3, Elasticsearch…). En mode **distribué**, plusieurs *workers* partagent la charge et stockent leur état dans trois topics Kafka.

```properties config/connect-distributed.properties
bootstrap.servers=kafka1:9092,kafka2:9092,kafka3:9092
group.id=connect-grappe
config.storage.topic=connect-configs
offset.storage.topic=connect-offsets
status.storage.topic=connect-status
config.storage.replication.factor=3
offset.storage.replication.factor=3
status.storage.replication.factor=3
key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
plugin.path=/opt/connect/plugins
listeners=http://0.0.0.0:8083
```

```bash
bin/connect-distributed.sh config/connect-distributed.properties
curl -s localhost:8083/connector-plugins | jq '.[].class'
curl -s localhost:8083/connectors?expand=status | jq
curl -X PUT -H 'Content-Type: application/json' localhost:8083/connectors/pg-boutique/config -d @pg-boutique.json
curl -X POST localhost:8083/connectors/pg-boutique/restart?includeTasks=true
curl -X PUT localhost:8083/connectors/pg-boutique/pause
curl -X DELETE localhost:8083/connectors/pg-boutique
```

- **SMT** (*Single Message Transforms*) : renommer, filtrer, extraire un champ, router vers un autre topic, directement dans le connecteur.
- **Erreurs** : `errors.tolerance=all` + `errors.deadletterqueue.topic.name` (connecteurs sink) pour isoler les messages invalides au lieu d'arrêter la tâche.
- L'API REST n'a **pas d'authentification** par défaut : la limiter au réseau d'administration ou l'activer (extension JAAS, proxy).

## Debezium

| Base | Prérequis |
| --- | --- |
| PostgreSQL | `wal_level=logical`, rôle avec `REPLICATION`, publication, greffon `pgoutput` |
| MySQL / MariaDB | `binlog_format=ROW`, `binlog_row_image=FULL`, GTID conseillé, droits `REPLICATION SLAVE, REPLICATION CLIENT` |
| SQL Server | CDC activé sur la base et les tables (`sys.sp_cdc_enable_db`) |
| Oracle | LogMiner (journal d'archivage, *supplemental logging*) |
| MongoDB | Jeu de réplicas ou grappe fragmentée (*change streams*) |

```sql
-- PostgreSQL
ALTER SYSTEM SET wal_level = logical;           -- redémarrage nécessaire
CREATE ROLE debezium WITH LOGIN REPLICATION PASSWORD '…';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO debezium;
CREATE PUBLICATION dbz_publication FOR TABLE public.commandes, public.clients;
```

```json pg-boutique.json
{
  "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
  "database.hostname": "pg1", "database.port": "5432",
  "database.user": "debezium", "database.password": "${file:/opt/connect/secrets.properties:pg.password}",
  "database.dbname": "boutique",
  "topic.prefix": "boutique",
  "plugin.name": "pgoutput",
  "publication.name": "dbz_publication",
  "slot.name": "debezium_boutique",
  "table.include.list": "public.commandes,public.clients",
  "snapshot.mode": "initial"
}
```

Chaque table produit un topic (`boutique.public.commandes`) ; un événement contient `before`, `after`, `op` (`c`, `u`, `d`, `r` pour l'instantané) et `source` (position dans le journal, horodatage).

- **Instantané initial** puis flux continu ; les **signaux** (table ou topic de signalisation) déclenchent des instantanés incrémentaux sans arrêt.
- **Debezium Server** : même capture **sans Kafka**, vers Redis, Pulsar, NATS, Kinesis, Google Pub/Sub, HTTP…
- Image de conteneur `quay.io/debezium/connect` prête à l'emploi ; une interface web (Debezium UI / plate-forme) facilite la gestion.

## Pièges

> [!WARNING]
> Un **slot de réplication** PostgreSQL inactif (connecteur arrêté) empêche la suppression du WAL : le disque du serveur se remplit. Surveiller `pg_replication_slots` et supprimer les slots orphelins (`SELECT pg_drop_replication_slot('debezium_boutique');`).

- Côté MySQL, la **rétention du binlog** doit couvrir les arrêts du connecteur, sinon un nouvel instantané est nécessaire.
- Modifications de schéma : Debezium les suit, mais les consommateurs doivent les tolérer (registre de schémas et Avro conseillés).
- Superviser le **retard** (métriques JMX `MilliSecondsBehindSource`) et l'état des tâches via l'API REST.

Voir aussi : [[02-benthos-flink-cdc|Redpanda Connect et Flink CDC]] · Kafka et [[12-recherche-messages/09-nats-nsq-zeromq-redpanda/03-redpanda|Redpanda]]. Commandes : [[90-aide-memoire|aide-mémoire]].

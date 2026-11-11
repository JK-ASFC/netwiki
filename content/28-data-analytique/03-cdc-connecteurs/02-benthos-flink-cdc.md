---
title: Benthos / Redpanda Connect et Flink CDC
description: Benthos devenu Redpanda Connect (traitement de flux déclaratif en YAML : input, pipeline, processeurs Bloblang, output, buffers, accusés de bout en bout, commandes rpk connect, licences et fork Bento) et Flink CDC (capture de changements MySQL, PostgreSQL, Oracle, MongoDB sur Flink, pipelines YAML vers Doris, StarRocks, Paimon, Kafka, synchronisation de schémas, flink-cdc.sh) ; comparaison avec Debezium.
tags: [benthos, redpanda connect, bento, bloblang, flink cdc, cdc, streaming, yaml]
icon: git-compare
---

## Benthos / Redpanda Connect

**Benthos** est un outil de **traitement de flux déclaratif** : un fichier YAML relie une **entrée** à une **sortie** en passant par des **processeurs**. Racheté par Redpanda, il s'appelle désormais **Redpanda Connect** ; un fork communautaire sous licence MIT, **Bento**, poursuit l'ancienne base.

> [!NOTE]
> Dans Redpanda Connect, la plupart des connecteurs restent sous licence Apache 2.0, mais certains relèvent de la licence Enterprise de Redpanda. Vérifier la licence des composants utilisés.

```yaml connect.yaml
input:
  kafka_franz:
    seed_brokers: [ "kafka:9092" ]
    topics: [ "boutique.public.commandes" ]
    consumer_group: vers-elastic

pipeline:
  processors:
    - mapping: |
        root = this.after
        root.montant_ttc = this.after.montant * 1.2
        root.recu_le = now()
    - catch:
        - log: { level: ERROR, message: "${! error() }" }
        - mapping: root = deleted()

output:
  elasticsearch_v8:
    urls: [ "https://elastic:9200" ]
    index: commandes
    id: ${! json("id") }
    basic_auth: { enabled: true, username: connect, password: "${ELASTIC_MDP}" }
```

```bash
rpk connect run connect.yaml                     # Redpanda Connect via rpk
rpk connect lint connect.yaml
rpk connect list inputs                          # composants disponibles
docker run --rm -v $PWD/connect.yaml:/connect.yaml docker.redpanda.com/redpandadata/connect run /connect.yaml
```

- **Bloblang** : langage de transformation intégré (`mapping`), testable avec `rpk connect blobl server`.
- **Accusés de bout en bout** : un message n'est validé à la source qu'une fois écrit en sortie — pas de perte sans disque intermédiaire.
- Entrées et sorties très nombreuses : Kafka, NATS, MQTT, AMQP, HTTP, S3, bases SQL, Redis, fichiers ; métriques Prometheus sur `:4195/metrics`.

## Flink CDC

**Flink CDC** capture les changements des bases (MySQL, PostgreSQL, Oracle, SQL Server, MongoDB, TiDB…) **directement dans Flink**, sans Kafka ni Kafka Connect. Il combine instantané initial parallèle sans verrou et lecture du journal, avec la garantie « exactement une fois » de Flink.

Deux usages :

1. **Connecteurs SQL / DataStream** dans une application Flink (`'connector' = 'mysql-cdc'`).
2. **Pipelines YAML** de synchronisation complète d'une base vers une destination (Doris, StarRocks, Paimon, Kafka, Elasticsearch…), avec **propagation des changements de schéma**.

```yaml mysql-vers-doris.yaml
source:
  type: mysql
  hostname: mysql
  port: 3306
  username: flinkcdc
  password: "…"
  tables: boutique.\.*
  server-id: 5400-5404

sink:
  type: doris
  fenodes: doris-fe:8030
  username: root
  password: "…"

pipeline:
  name: synchro-boutique
  parallelism: 4
```

```bash
# Avec une grappe Flink démarrée (FLINK_HOME défini) et les JAR des connecteurs dans lib/
bash bin/flink-cdc.sh mysql-vers-doris.yaml
```

```sql
-- Connecteur SQL dans Flink
CREATE TABLE commandes (
  id INT, client STRING, montant DECIMAL(10,2), PRIMARY KEY (id) NOT ENFORCED
) WITH ('connector' = 'mysql-cdc', 'hostname' = 'mysql', 'port' = '3306',
        'username' = 'flinkcdc', 'password' = '…',
        'database-name' = 'boutique', 'table-name' = 'commandes');
```

Prérequis côté base identiques à Debezium (binlog ROW, réplication logique…), Flink CDC réutilisant en partie le code de Debezium.

## Comparatif

| Critère | [[01-debezium-kafka-connect\|Debezium]] | Redpanda Connect | Flink CDC |
| --- | --- | --- | --- |
| Rôle | Capture de changements | Transport et transformation | Capture + traitement |
| Infrastructure | Kafka Connect (ou Debezium Server) | Un binaire | Grappe Flink |
| Transformations | SMT simples | Bloblang complet | SQL / API Flink |
| Cas typique | Publier les changements dans Kafka | Relier systèmes, enrichir, router | Synchroniser une base vers un entrepôt analytique |

Voir aussi : [[01-traitement-flux-lots/02-apache-flink|Apache Flink]]. Commandes : [[90-aide-memoire|aide-mémoire]].

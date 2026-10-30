---
title: Apache Kafka — aide-mémoire des commandes
description: Commandes Kafka avec exemples — stockage KRaft (kafka-storage format, random-uuid), service, sujets (kafka-topics : création, description, partitions, configuration), producteur et consommateur console, groupes de consommateurs (décalage, réinitialisation des offsets), configuration dynamique (kafka-configs), réaffectation de partitions, élection de leaders, quorum KRaft (kafka-metadata-quorum), ACL, performances, kcat.
tags: [aide-mémoire, kafka, kraft, kafka-topics, consumer groups, kcat]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Kafka]]. Les scripts sont dans `/opt/kafka/bin` (suffixe `.sh` ; `.bat` sous Windows). Avec TLS/SASL, ajoutez `--command-config client.properties`.

```bash
B=kafka1.exemple.fr:9092
```

## KRaft et service

```bash
KAFKA_CLUSTER_ID=$(kafka-storage.sh random-uuid)
kafka-storage.sh format -t "$KAFKA_CLUSTER_ID" -c /opt/kafka/config/server.properties
sudo systemctl start kafka
kafka-metadata-quorum.sh --bootstrap-server $B describe --status
kafka-metadata-quorum.sh --bootstrap-server $B describe --replication
kafka-broker-api-versions.sh --bootstrap-server $B | head -3
```

## Sujets

```bash
kafka-topics.sh --bootstrap-server $B --create --topic journaux-reseau --partitions 6 --replication-factor 3 --config retention.ms=604800000
kafka-topics.sh --bootstrap-server $B --list
kafka-topics.sh --bootstrap-server $B --describe --topic journaux-reseau
kafka-topics.sh --bootstrap-server $B --describe --under-replicated-partitions
kafka-topics.sh --bootstrap-server $B --alter --topic journaux-reseau --partitions 12      # augmenter seulement
kafka-topics.sh --bootstrap-server $B --delete --topic ancien-sujet
kafka-configs.sh --bootstrap-server $B --alter --entity-type topics --entity-name journaux-reseau --add-config retention.ms=1209600000
kafka-configs.sh --bootstrap-server $B --describe --entity-type topics --entity-name journaux-reseau
```

## Produire et consommer

```bash
kafka-console-producer.sh --bootstrap-server $B --topic journaux-reseau --property parse.key=true --property key.separator=:
kafka-console-consumer.sh --bootstrap-server $B --topic journaux-reseau --from-beginning --max-messages 10
kafka-console-consumer.sh --bootstrap-server $B --topic journaux-reseau --group test --property print.key=true --property print.timestamp=true
kafka-get-offsets.sh --bootstrap-server $B --topic journaux-reseau
```

## Groupes de consommateurs

```bash
kafka-consumer-groups.sh --bootstrap-server $B --list
kafka-consumer-groups.sh --bootstrap-server $B --describe --group siem
kafka-consumer-groups.sh --bootstrap-server $B --describe --group siem --members --verbose
kafka-consumer-groups.sh --bootstrap-server $B --group siem --topic journaux-reseau --reset-offsets --to-datetime 2026-10-29T08:00:00.000 --dry-run
kafka-consumer-groups.sh --bootstrap-server $B --group siem --topic journaux-reseau --reset-offsets --to-earliest --execute
kafka-consumer-groups.sh --bootstrap-server $B --delete --group ancien-groupe
```

La colonne **LAG** de `--describe` indique le retard de chaque partition.

## Partitions et leaders

```bash
kafka-reassign-partitions.sh --bootstrap-server $B --topics-to-move-json-file sujets.json --broker-list "1,2,3,4" --generate
kafka-reassign-partitions.sh --bootstrap-server $B --reassignment-json-file plan.json --execute --throttle 50000000
kafka-reassign-partitions.sh --bootstrap-server $B --reassignment-json-file plan.json --verify
kafka-leader-election.sh --bootstrap-server $B --election-type preferred --all-topic-partitions
```

## ACL et performances

```bash
kafka-acls.sh --bootstrap-server $B --command-config admin.properties --add --allow-principal User:siem --operation Read --topic journaux-reseau --group siem
kafka-acls.sh --bootstrap-server $B --command-config admin.properties --list --topic journaux-reseau
kafka-producer-perf-test.sh --topic perf --num-records 1000000 --record-size 512 --throughput -1 --producer-props bootstrap.servers=$B acks=all
kafka-consumer-perf-test.sh --bootstrap-server $B --topic perf --messages 1000000
```

## kcat (outil léger)

```bash
kcat -b $B -L                                   # métadonnées
kcat -b $B -t journaux-reseau -C -o -10 -e      # 10 derniers messages
echo "cle:valeur" | kcat -b $B -t journaux-reseau -P -K:
```

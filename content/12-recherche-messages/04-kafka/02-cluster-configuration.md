---
title: Cluster KRaft et configuration des brokers
description: Monter un cluster Kafka en mode KRaft (rôles broker et contrôleur, quorum de contrôleurs, formatage du stockage), configurer server.properties (listeners et advertised.listeners, répertoires, réplication par défaut, min.insync.replicas, rétention), dimensionner les partitions, et régler producteurs et consommateurs pour la durabilité.
tags: [kafka, kraft, server.properties, listeners, réplication, min.insync.replicas, rétention, partitions]
icon: settings-2
---

## Architecture

| Rôle (`process.roles`) | Fonction |
| --- | --- |
| `controller` | Membre du quorum KRaft : métadonnées du cluster, élection des leaders |
| `broker` | Héberge les partitions, sert les clients |
| `broker,controller` | Mode combiné (petits clusters) |

Petits clusters : **3 nœuds combinés**. Grands clusters : **3 (ou 5) contrôleurs dédiés** + N brokers.

## server.properties (3 nœuds combinés)

```kafka /opt/kafka/config/server.properties (kafka1)
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@kafka1.corp.exemple.fr:9093,2@kafka2.corp.exemple.fr:9093,3@kafka3.corp.exemple.fr:9093

listeners=PLAINTEXT://:9092,CONTROLLER://:9093
advertised.listeners=PLAINTEXT://kafka1.corp.exemple.fr:9092
controller.listener.names=CONTROLLER
inter.broker.listener.name=PLAINTEXT
listener.security.protocol.map=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT

log.dirs=/var/lib/kafka/data

# Durabilité
default.replication.factor=3
min.insync.replicas=2
offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=2
unclean.leader.election.enable=false
auto.create.topics.enable=false

# Rétention par défaut
num.partitions=6
log.retention.hours=168
log.segment.bytes=1073741824
```

```bash
# Un identifiant de cluster commun, puis formatage de chaque nœud
KAFKA_CLUSTER_ID=$(/opt/kafka/bin/kafka-storage.sh random-uuid)      # sur un seul nœud, à recopier
sudo -u kafka /opt/kafka/bin/kafka-storage.sh format -t "$KAFKA_CLUSTER_ID" -c /opt/kafka/config/server.properties
sudo systemctl enable --now kafka
/opt/kafka/bin/kafka-metadata-quorum.sh --bootstrap-server kafka1:9092 describe --status
```

> [!IMPORTANT]
> `advertised.listeners` est l'adresse **donnée aux clients** pour joindre ce broker : elle doit être résolvable et joignable depuis les clients. Une valeur `localhost` ou une IP interne derrière un NAT est la cause la plus fréquente d'échecs de connexion.

## Paramètres de durabilité

| Paramètre | Recommandation |
| --- | --- |
| `replication.factor` (par topic) | 3 |
| `min.insync.replicas` | 2 : une écriture `acks=all` exige 2 copies à jour |
| `unclean.leader.election.enable` | `false` : jamais de leader hors ISR (évite la perte de données) |
| `auto.create.topics.enable` | `false` en production : topics créés explicitement |

Côté **producteur** : `acks=all`, `enable.idempotence=true` (défaut récent), `retries` élevé. Côté **consommateur** : validation des offsets après traitement, `max.poll.interval.ms` adapté à la durée de traitement.

## Topics

```bash
B=kafka1.corp.exemple.fr:9092
/opt/kafka/bin/kafka-topics.sh --bootstrap-server $B --create --topic journaux-reseau \
  --partitions 12 --replication-factor 3 --config retention.ms=604800000 --config compression.type=zstd
/opt/kafka/bin/kafka-topics.sh --bootstrap-server $B --describe --topic journaux-reseau
/opt/kafka/bin/kafka-configs.sh --bootstrap-server $B --alter --entity-type topics --entity-name journaux-reseau \
  --add-config retention.ms=1209600000
/opt/kafka/bin/kafka-topics.sh --bootstrap-server $B --alter --topic journaux-reseau --partitions 24
```

| Choix | Remarques |
| --- | --- |
| Nombre de partitions | ≥ nombre maximal de consommateurs parallèles d'un groupe ; on peut **augmenter** (pas diminuer), mais cela change la répartition des clés |
| `cleanup.policy=compact` | Garde la dernière valeur par clé (états, configurations) |
| `compression.type` | `zstd` ou `lz4` : moins de réseau et de disque |
| `max.message.bytes` | Taille maximale d'un message (≈ 1 Mo par défaut) |

## Matériel et système

| Ressource | Conseil |
| --- | --- |
| Disques | Plusieurs disques dans `log.dirs` ou RAID 10 ; XFS ; débit séquentiel |
| Mémoire | Tas JVM modeste (4-6 Go) : Kafka s'appuie sur le **cache de pages** du système |
| Réseau | 10 GbE pour les gros débits ; latence faible entre brokers |
| Système | `vm.swappiness=1`, `nofile` ≥ 100000, synchronisation horaire |
| Racks / zones | `broker.rack` pour répartir les réplicas sur plusieurs baies ou zones |

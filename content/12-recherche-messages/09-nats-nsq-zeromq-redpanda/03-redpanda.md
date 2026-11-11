---
title: Redpanda
description: Redpanda, plate-forme de streaming compatible avec l'API Kafka écrite en C++ (sans JVM ni ZooKeeper, consensus Raft) — licences (Community sous BSL, fonctions Enterprise), architecture, ports, installation (Docker, paquets), réglage du système (rpk redpanda tune), CLI rpk (cluster, topic, group, acl), Redpanda Console, registre de schémas et proxy HTTP intégrés, stockage étagé, sécurité SASL/TLS et migration depuis Kafka.
tags: [redpanda, kafka, streaming, rpk, raft, registre de schémas, c++]
icon: zap
---

**Redpanda** parle le **protocole Kafka** : producteurs, consommateurs, Kafka Connect et la plupart des outils Kafka fonctionnent sans modification. Écrit en C++ (modèle *thread-per-core*), il se distribue en **un seul binaire**, sans JVM ni ZooKeeper, et vise une latence plus faible et une exploitation plus simple.

> [!NOTE]
> **Licence** : l'édition *Community* est publiée sous **BSL 1.1** (code source disponible, usage libre sauf pour proposer Redpanda en tant que service) ; certaines fonctions (stockage étagé, réplication entre grappes, sécurité avancée, console complète) relèvent de l'édition **Enterprise** sous licence. Ce n'est donc pas un logiciel libre au sens strict, contrairement à Apache Kafka.

## Architecture et ports

| Port | Usage |
| --- | --- |
| 9092 | API Kafka |
| 8081 | Registre de schémas (Schema Registry, intégré) |
| 8082 | Proxy HTTP (*Pandaproxy*, REST) |
| 9644 | API d'administration, métriques Prometheus (`/public_metrics`) |
| 33145 | Communication interne (Raft) |

Chaque partition est un groupe **Raft** ; trois nœuds au minimum pour la tolérance de panne (réplication 3).

## Installation

```bash
# Docker (essai, un nœud)
docker run -d --name redpanda -p 9092:9092 -p 9644:9644 -p 8081:8081 -p 8082:8082 \
  docker.redpanda.com/redpandadata/redpanda:latest \
  redpanda start --mode dev-container --smp 1 --kafka-addr 0.0.0.0:9092 --advertise-kafka-addr localhost:9092

# Paquets (Debian/Ubuntu, RHEL) : dépôt du projet, puis
sudo rpk redpanda mode production
sudo rpk redpanda tune all              # réglages du noyau, du disque et du réseau
sudo systemctl enable --now redpanda
```

Configuration : `/etc/redpanda/redpanda.yaml` (nœud, adresses annoncées, graines de la grappe), et propriétés de grappe via `rpk cluster config`.

## rpk

```bash
rpk cluster info ; rpk cluster health
rpk topic create evenements -p 6 -r 3
rpk topic list ; rpk topic describe evenements
echo '{"id": 1}' | rpk topic produce evenements
rpk topic consume evenements --offset start --num 10
rpk group list ; rpk group describe groupe-analyse            # retard des consommateurs
rpk cluster config set log_retention_ms 604800000              # 7 jours
rpk acl user create app -p 'Mot-De-Passe' --mechanism SCRAM-SHA-256
rpk acl create --allow-principal User:app --operation read,write --topic evenements
```

**Redpanda Console** (interface web, image `redpandadata/console`) affiche topics, messages, groupes, schémas et ACL ; elle fonctionne aussi avec Apache Kafka.

## Sécurité

- **SASL/SCRAM** ou mTLS pour l'authentification, **TLS** sur l'API Kafka, le proxy et l'administration.
- ACL compatibles Kafka.
- Ne pas exposer l'API d'administration (9644) hors du réseau de gestion.

## Migrer depuis Kafka

Les clients changent seulement d'adresse ; les données se copient avec **MirrorMaker 2** ou Redpanda Connect, en mode miroir le temps de basculer producteurs puis consommateurs. Vérifier les fonctions spécifiques utilisées (transactions, compactage, Kafka Streams) et la licence.

Voir aussi la page Kafka du wiki et [[01-nats|NATS]]. Commandes : [[90-aide-memoire|aide-mémoire]].

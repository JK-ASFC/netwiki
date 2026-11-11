---
title: ActiveMQ, RocketMQ et Pulsar — aide-mémoire
description: Ports et commandes d'ActiveMQ Classic (activemq start, producer, consumer, dstat), ActiveMQ Artemis (artemis create, run, queue stat, producer, consumer), RocketMQ (mqnamesrv, mqbroker, mqadmin) et Pulsar (standalone, pulsar-admin, pulsar-client).
tags: [aide-mémoire, activemq, artemis, rocketmq, pulsar]
icon: terminal
---

Explications : [[01-activemq-classic-artemis|ActiveMQ Classic et Artemis]] · [[02-rocketmq-pulsar|RocketMQ et Pulsar]].

## Ports

| Produit | Ports |
| --- | --- |
| ActiveMQ Classic | 61616 OpenWire, 5672 AMQP, 61613 STOMP, 1883 MQTT, 61614 WS, 8161 console |
| ActiveMQ Artemis | 61616 (tous protocoles), 5672, 61613, 1883 selon accepteurs, 8161 console |
| RocketMQ | 9876 NameServer, 10911 Broker, 8081 Proxy gRPC |
| Pulsar | 6650 binaire (6651 TLS), 8080 HTTP admin (8443 TLS) |

## Commandes

```bash
# ActiveMQ Classic
bin/activemq start|stop|status ; bin/activemq dstat queues
bin/activemq producer --destination queue://TEST --messageCount 10

# ActiveMQ Artemis
bin/artemis create /var/lib/artemis/broker1 --user admin --password '…' --require-login
/var/lib/artemis/broker1/bin/artemis run ; bin/artemis queue stat --user admin --password '…'

# RocketMQ
nohup sh bin/mqnamesrv &
nohup sh bin/mqbroker -n localhost:9876 --enable-proxy &
sh bin/mqadmin clusterList ; sh bin/mqadmin updateTopic -n localhost:9876 -c DefaultCluster -t Commandes
sh bin/mqadmin consumerProgress -g groupe

# Pulsar
bin/pulsar standalone
bin/pulsar-admin tenants create acme ; bin/pulsar-admin namespaces create acme/app
bin/pulsar-admin topics stats persistent://acme/app/evenements
bin/pulsar-client produce persistent://acme/app/evenements -m "test" -n 10
bin/pulsar-client consume persistent://acme/app/evenements -s abo -n 0
```

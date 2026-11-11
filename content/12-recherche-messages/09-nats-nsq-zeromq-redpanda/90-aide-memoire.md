---
title: NATS, NSQ, ZeroMQ et Redpanda — aide-mémoire
description: Ports et commandes de NATS (nats pub, sub, stream, consumer, kv, server report, bench), NSQ (nsqd, nsqlookupd, pub HTTP, nsq_tail), ZeroMQ (pyzmq) et Redpanda (rpk cluster, topic, group, acl, tune).
tags: [aide-mémoire, nats, jetstream, nsq, zeromq, redpanda, rpk]
icon: terminal
---

Explications : [[01-nats|NATS et JetStream]] · [[02-nsq-zeromq|NSQ et ZeroMQ]] · [[03-redpanda|Redpanda]].

## Ports

| Produit | Ports |
| --- | --- |
| NATS | 4222 clients, 8222 supervision, 6222 grappe, 7422 nœuds feuilles |
| NSQ | nsqd 4150/4151, nsqlookupd 4160/4161, nsqadmin 4171 |
| Redpanda | 9092 Kafka, 8081 schémas, 8082 HTTP, 9644 admin, 33145 Raft |

## Commandes

```bash
# NATS
nats context save local --server nats://localhost:4222 --select
nats pub usine.lyon.temp '21.5' ; nats sub "usine.>"
nats stream add MESURES --subjects "usine.>" --storage file --replicas 3 --defaults
nats consumer add MESURES analyse --pull --defaults ; nats stream report
nats kv add CONFIG ; nats kv put CONFIG cle valeur ; nats kv get CONFIG cle
nats server report jetstream ; curl -s localhost:8222/healthz

# NSQ
curl -d 'message' 'http://127.0.0.1:4151/pub?topic=commandes'
nsq_tail --lookupd-http-address=127.0.0.1:4161 --topic=commandes

# Redpanda
rpk cluster info ; rpk cluster health
rpk topic create evenements -p 6 -r 3 ; rpk topic consume evenements --num 10
rpk group describe groupe-analyse
sudo rpk redpanda tune all
```

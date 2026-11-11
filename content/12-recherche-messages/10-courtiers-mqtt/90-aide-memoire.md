---
title: VerneMQ, NanoMQ et HiveMQ CE — aide-mémoire
description: Ports et commandes de VerneMQ (vmq-passwd, vmq-admin cluster, session, metrics), NanoMQ (nanomq start, nanomq_cli pub et sub) et HiveMQ CE (Docker, run.sh).
tags: [aide-mémoire, vernemq, nanomq, hivemq, mqtt]
icon: terminal
---

Explications : [[01-vernemq|VerneMQ]] · [[02-nanomq-hivemq|NanoMQ et HiveMQ CE]].

## Ports

| Courtier | Ports |
| --- | --- |
| VerneMQ | 1883 MQTT, 8883 TLS, 8080 WebSocket, 8888 HTTP/métriques, 44053 grappe |
| NanoMQ | 1883 MQTT, 8883 TLS, 8083 WebSocket, 8081 API HTTP |
| HiveMQ CE | 1883 MQTT, 8883 TLS (si configuré), 8000 WebSocket (si configuré) |

## Commandes

```bash
# VerneMQ
vmq-passwd -c /etc/vernemq/vmq.passwd capteur01
vmq-admin cluster show ; vmq-admin cluster join discovery-node=VerneMQ@10.0.0.11
vmq-admin session show --client_id --is_online
vmq-admin metrics show ; curl -s localhost:8888/metrics

# NanoMQ
nanomq start --conf /etc/nanomq.conf
nanomq_cli pub -t capteurs/temp -m 21.5 -q 1 ; nanomq_cli sub -t "capteurs/#"

# HiveMQ CE
docker run -d --name hivemq -p 1883:1883 hivemq/hivemq-ce
bin/run.sh

# Test générique (client Mosquitto)
mosquitto_pub -h courtier -u capteur01 -P '…' -t usine/lyon/temp -m 21.5
mosquitto_sub -h courtier -u tableau -P '…' -t "usine/#" -v
```

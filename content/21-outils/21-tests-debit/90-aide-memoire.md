---
title: Tests de débit — aide-mémoire
description: Commandes iperf2 (serveur, client, UDP, parallèle, bidirectionnel), déploiement d'OpenSpeedTest, LibreSpeed et Speedtest Tracker, ports à ouvrir.
tags: [aide-mémoire, iperf2, iperf3, openspeedtest, librespeed, speedtest tracker]
icon: terminal
---

Explications : [[01-iperf2-openspeedtest-librespeed|iperf2, OpenSpeedTest, LibreSpeed et Speedtest Tracker]].

| Outil | Port |
| --- | --- |
| iperf2 | 5001 TCP/UDP |
| iperf3 (rappel) | 5201 |
| OpenSpeedTest | 3000 (3001 HTTPS) |
| LibreSpeed | 80 (conteneur) |
| Speedtest Tracker | 80 (conteneur) |

```bash
# iperf2
iperf -s                     # serveur TCP ; -u pour UDP
iperf -c serveur -t 20 -i 2  # 20 s, rapport /2 s
iperf -c serveur -P 8        # 8 flux parallèles
iperf -c serveur -d          # bidirectionnel simultané
iperf -c serveur -u -b 200M  # UDP 200 Mbit/s : gigue et pertes

# OpenSpeedTest
docker run -d -p 3000:3000 -p 3001:3001 openspeedtest/latest

# LibreSpeed
docker run -d -p 8080:80 -e MODE=standalone -e TELEMETRY=false ghcr.io/librespeed/speedtest:latest
librespeed-cli --local-json serveurs.json      # mesure en ligne de commande

# Speedtest Tracker
docker compose up -d          # APP_KEY, DB, SPEEDTEST_SCHEDULE dans le compose
```

---
title: LoRaWAN et passerelles — aide-mémoire
description: Déploiement de ChirpStack et The Things Stack, sujets MQTT ChirpStack, CLI ttn-lw-cli, pont Mosquitto et déploiement de ThingsBoard IoT Gateway.
tags: [aide-mémoire, lorawan, chirpstack, the things stack, mosquitto, thingsboard gateway]
icon: terminal
---

Explications : [[01-chirpstack-ttn|ChirpStack et The Things Stack]] · [[02-mosquitto-iot-gateway|Mosquitto et ThingsBoard Gateway]].

| Service | Ports |
| --- | --- |
| ChirpStack | 8080 interface/API, 1700/udp Semtech (gateway bridge), 1883 MQTT |
| The Things Stack | 1885 console, 8881 MQTT, 1700/udp |
| Mosquitto (rappel) | 1883, 8883 TLS |

```bash
# ChirpStack
git clone https://github.com/chirpstack/chirpstack-docker && cd chirpstack-docker && docker compose up -d
mosquitto_sub -h serveur -t 'application/+/device/+/event/up' -v        # données remontées

# The Things Stack
ttn-lw-cli login
ttn-lw-cli end-devices list --application-id mon-appli

# ThingsBoard IoT Gateway
docker run -d --name tb-gateway -v /srv/tb-gateway/config:/thingsboard_gateway/config thingsboard/tb-gateway
docker logs -f tb-gateway

# Mosquitto : pont vers un central (voir la page Mosquitto)
mosquitto_sub -h localhost -t 'usine/#' -v
```

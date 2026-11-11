---
title: Plates-formes IoT — aide-mémoire
description: Ports et déploiement de ThingsBoard Community (Docker, MQTT télémétrie), Magistrala (Mainflux) et Eclipse Kura, et publication de télémétrie de test.
tags: [aide-mémoire, thingsboard, mainflux, magistrala, kura, iot, mqtt]
icon: terminal
---

Explications : [[01-thingsboard-mainflux|ThingsBoard et Magistrala]] · [[02-kaa-kura|Kaa et Eclipse Kura]].

| Plate-forme | Ports |
| --- | --- |
| ThingsBoard CE | 8080 interface, 1883 MQTT, 5683-5688/udp CoAP, 7070 edge |
| Magistrala | passerelle HTTP/MQTT/CoAP (selon compose) |
| Eclipse Kura | 443 interface d'administration |

```bash
# ThingsBoard
docker run -d --name thingsboard -p 8080:9090 -p 1883:1883 -p 5683-5688:5683-5688/udp \
  -v /srv/tb/data:/data thingsboard/tb-postgres
# Publier de la télémétrie depuis un appareil (jeton d'accès de l'appareil)
mosquitto_pub -h serveur -t v1/devices/me/telemetry -u "$JETON" -m '{"temperature":21.5,"humidite":48}'

# Magistrala (Mainflux)
docker compose -f docker/docker-compose.yml up -d

# Eclipse Kura
docker run -d --name kura -p 443:443 eclipse/kura:latest
```

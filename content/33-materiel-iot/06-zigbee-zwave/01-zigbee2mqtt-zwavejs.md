---
title: Zigbee2MQTT et Z-Wave JS UI
description: Relier des objets Zigbee et Z-Wave à une installation domotique via MQTT — Zigbee2MQTT (clé/coordinateur Zigbee, publication des appareils sur MQTT, interface web, appairage, découverte Home Assistant, configuration.yaml, port 8080) et Z-Wave JS UI (contrôleur Z-Wave USB, pilote Z-Wave JS, interface de gestion, passerelle MQTT, inclusion sécurisée S2, port 8091) ; indépendance vis-à-vis du cloud, coordinateurs recommandés et sécurité.
tags: [zigbee2mqtt, zwave-js-ui, zigbee, z-wave, mqtt, domotique, passerelle, home assistant]
icon: cpu
---

Les objets **Zigbee** et **Z-Wave** (ampoules, prises, capteurs, serrures) communiquent par radio maillée, pas en Wi-Fi. Pour les intégrer à une domotique auto-hébergée **sans passer par le cloud ni le pont du fabricant**, on utilise un **coordinateur USB** et un logiciel qui expose les appareils sur **MQTT**.

## Zigbee2MQTT

**Zigbee2MQTT** pilote un **coordinateur Zigbee** (clé USB) et publie chaque appareil sur des sujets MQTT, avec une interface web pour l'appairage et la gestion. Il prend en charge des milliers de modèles de toutes marques.

```yaml data/configuration.yaml
mqtt:
  base_topic: zigbee2mqtt
  server: mqtt://127.0.0.1:1883
  user: zigbee
  password: "…"
serial:
  port: /dev/serial/by-id/usb-...        # coordinateur (identifiant stable)
  adapter: ember                          # selon la puce (ember pour EFR32, zstack pour CC2652…)
frontend:
  port: 8080
homeassistant: true                        # découverte automatique dans Home Assistant
advanced:
  network_key: GENERATE                    # clé de réseau Zigbee (générée au premier démarrage)
  pan_id: GENERATE
```

```bash
docker run -d --name zigbee2mqtt --restart unless-stopped \
  -p 127.0.0.1:8080:8080 \
  -v /srv/zigbee2mqtt:/app/data -v /run/udev:/run/udev:ro \
  --device=/dev/serial/by-id/usb-...:/dev/ttyACM0 \
  -e TZ=Europe/Paris koenkk/zigbee2mqtt
```

- **Coordinateurs** recommandés : à base de puces Silicon Labs EFR32 (série actuelle) ou Texas Instruments CC2652 ; une **rallonge USB** éloigne la clé du boîtier (interférences USB 3.0/Wi-Fi).
- Les **routeurs** (appareils sur secteur) étendent le maillage ; les capteurs sur pile sont des terminaux.
- L'appairage se fait appareil par appareil depuis l'interface (« permit join » limité dans le temps, à ne pas laisser ouvert).

## Z-Wave JS UI

**Z-Wave JS UI** (anciennement zwavejs2mqtt) pilote un **contrôleur Z-Wave** USB via le pilote **Z-Wave JS** (le plus abouti), avec une interface de gestion complète et une **passerelle MQTT**. Il s'intègre aussi directement à Home Assistant (WebSocket).

```bash
docker run -d --name zwave-js-ui --restart unless-stopped \
  -p 127.0.0.1:8091:8091 -p 127.0.0.1:3000:3000 \
  -v /srv/zwave-js-ui:/usr/src/app/store \
  --device=/dev/serial/by-id/usb-...:/dev/zwave \
  -e TZ=Europe/Paris zwavejs/zwave-js-ui:latest
# Interface de contrôle : http://serveur:8091 ; serveur WebSocket Z-Wave JS : 3000 (pour Home Assistant)
```

- Région radio à régler (**868,4 MHz en Europe**) ; inclusion **S2** (sécurisée) recommandée, indispensable pour les serrures.
- Sauvegarder le dossier `store` : il contient la **clé réseau** et la base des nœuds ; le perdre oblige à ré-inclure tous les appareils.

## Indépendance et sécurité

- Ces passerelles rendent les objets **autonomes vis-à-vis du cloud** : tout fonctionne en local, les données ne sortent pas.
- Protéger le **courtier MQTT** (authentification, ACL, TLS — voir [[05-mosquitto/01-presentation-configuration|Mosquitto]]) : qui accède au courtier contrôle les appareils.
- **Sauvegarder** les clés de réseau et les bases d'appairage ; ne pas laisser l'appairage ouvert en permanence.
- Garder coordinateur et logiciel à jour (corrections de sécurité, nouveaux modèles).

Voir aussi : [[02-esphome-tasmota|ESPHome, Tasmota et OpenMQTTGateway]] · [[04-domotique/01-home-assistant-openhab-domoticz|Home Assistant]]. Commandes : [[90-aide-memoire|aide-mémoire]].

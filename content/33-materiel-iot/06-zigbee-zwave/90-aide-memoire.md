---
title: Zigbee, Z-Wave et firmwares ESP — aide-mémoire
description: Ports, périphériques et commandes de Zigbee2MQTT, Z-Wave JS UI (Docker, coordinateur USB, sauvegarde des clés), ESPHome (compile, run, logs) et Tasmota (flash esptool, commandes MQTT).
tags: [aide-mémoire, zigbee2mqtt, zwave-js-ui, esphome, tasmota, openmqttgateway]
icon: terminal
---

Explications : [[01-zigbee2mqtt-zwavejs|Zigbee2MQTT et Z-Wave JS UI]] · [[02-esphome-tasmota|ESPHome, Tasmota et OpenMQTTGateway]].

| Outil | Port | Périphérique |
| --- | --- | --- |
| Zigbee2MQTT | 8080 | coordinateur Zigbee USB |
| Z-Wave JS UI | 8091 (interface), 3000 (WebSocket HA) | contrôleur Z-Wave USB |
| ESPHome Device Builder | 6052 | flash USB puis OTA |

```bash
# Identifier le coordinateur / contrôleur USB (identifiant stable)
ls -l /dev/serial/by-id/

# Zigbee2MQTT
docker run -d -p 8080:8080 -v /srv/zigbee2mqtt:/app/data \
  --device=/dev/serial/by-id/usb-XXX:/dev/ttyACM0 koenkk/zigbee2mqtt
mosquitto_sub -h 127.0.0.1 -t 'zigbee2mqtt/#' -v

# Z-Wave JS UI
docker run -d -p 8091:8091 -p 3000:3000 -v /srv/zwave-js-ui:/usr/src/app/store \
  --device=/dev/serial/by-id/usb-XXX:/dev/zwave zwavejs/zwave-js-ui:latest
# Sauvegarder /srv/zwave-js-ui/store (clés réseau !)

# ESPHome
python3 -m pip install esphome
esphome run appareil.yaml ; esphome logs appareil.yaml

# Tasmota
pip install esptool
esptool.py --port /dev/ttyUSB0 write_flash 0x0 tasmota.bin
# commandes MQTT : cmnd/<topic>/Power ON | cmnd/<topic>/Status 0
```

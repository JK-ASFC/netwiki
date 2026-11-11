---
title: ESPHome, Tasmota et OpenMQTTGateway
description: Firmwares libres pour microcontrôleurs ESP et passerelle multi-radio — ESPHome (configuration YAML compilée, nombreux capteurs et composants, flash USB ou OTA, API native Home Assistant ou MQTT, ESPHome Device Builder), Tasmota (firmware prêt à flasher pour prises et modules à base d'ESP, interface web, commandes et MQTT, Tasmotizer, règles), OpenMQTTGateway (passerelle ESP/Linux qui relaie 433 MHz, BLE, infrarouge, LoRa vers MQTT) ; reprendre le contrôle d'objets du commerce et sécurité.
tags: [esphome, tasmota, openmqttgateway, esp32, esp8266, firmware, mqtt, domotique, ble, 433mhz]
icon: cpu
---

Beaucoup d'objets connectés bon marché reposent sur des puces **ESP8266/ESP32**. En remplaçant leur **firmware** par un firmware libre, on les rend **locaux**, sans cloud, et pilotables en MQTT ou via Home Assistant.

## ESPHome

**ESPHome** décrit l'appareil en **YAML**, compile un firmware sur mesure et le téléverse (USB puis **OTA** par Wi-Fi). Immense bibliothèque de capteurs et composants (température, relais, écrans, LED adressables…).

```yaml capteur-salon.yaml
esphome:
  name: capteur-salon
esp32:
  board: esp32dev
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
api:                       # API native Home Assistant (chiffrée)
  encryption:
    key: !secret api_key
ota:
  - platform: esphome
sensor:
  - platform: dht
    pin: GPIO4
    temperature: { name: "Température salon" }
    humidity: { name: "Humidité salon" }
# Sans Home Assistant, remplacer « api: » par « mqtt: { broker: 192.0.2.50 } »
```

```bash
python3 -m pip install esphome
esphome compile capteur-salon.yaml
esphome run capteur-salon.yaml            # compile + téléverse (USB la 1re fois, OTA ensuite)
esphome logs capteur-salon.yaml
# Ou l'interface web « ESPHome Device Builder » (add-on Home Assistant ou conteneur), port 6052
```

L'intégration à [[04-domotique/01-home-assistant-openhab-domoticz|Home Assistant]] par l'**API native** (chiffrée) est transparente ; MQTT reste possible pour les autres plates-formes.

## Tasmota

**Tasmota** est un firmware **prêt à flasher** (pas de compilation) pour les appareils ESP du commerce (prises, interrupteurs, ampoules Sonoff et compatibles). Interface web immédiate, **commandes** et **MQTT**, règles simples.

```bash
# Flash initial : Tasmotizer ou esptool (appareil en mode programmation)
pip install esptool
esptool.py --port /dev/ttyUSB0 write_flash 0x0 tasmota.bin
# Ensuite : configuration Wi-Fi via le point d'accès de l'appareil, puis interface web
```

```text Console Tasmota (ou sujet MQTT cmnd/<appareil>/…)
Backlog MqttHost 192.0.2.50; MqttUser tasmota; MqttPassword ...; Topic prise-bureau
TelePeriod 60
PowerOnState 0
```

- Contrôle et télémétrie par MQTT (`cmnd/`, `stat/`, `tele/`), découverte Home Assistant possible.
- **Sauvegarder la configuration** (`Backup Configuration`) avant toute mise à jour.

## OpenMQTTGateway

**OpenMQTTGateway** transforme un ESP32 (ou un hôte Linux) en **passerelle multi-radio** : il relaie vers MQTT des signaux que la domotique ne capte pas nativement — **433 MHz** (télécommandes, capteurs bon marché), **Bluetooth LE** (capteurs de température, balises, pèse-personnes), **infrarouge**, **LoRa**.

```bash
# Firmware à flasher selon le matériel (ESP32 + récepteur 433 MHz / BLE intégré)
# via l'outil web « OMG install » ou PlatformIO ; configuration MQTT dans l'interface
```

Exemple : un ESP32 avec récepteur 433 MHz publie les capteurs de température d'une station météo bon marché sur `home/OpenMQTTGateway/433toMQTT`, utilisables ensuite dans Home Assistant.

## Reprendre le contrôle d'un objet du commerce

> [!WARNING]
> Flasher un firmware tiers **annule la garantie** et peut, en cas d'erreur, rendre l'appareil inutilisable (*brick*). Certains appareils récents utilisent des puces non ESP (impossible à flasher ainsi). Vérifier le modèle exact, repérer les broches de programmation, sauvegarder le firmware d'origine si possible, et ne jamais flasher à distance un appareil difficile d'accès.

Côté sécurité, ces objets rejoignent le **réseau IoT isolé** ; MQTT protégé par authentification, ACL et TLS ; firmwares tenus à jour.

## Choisir

| Besoin | Outil |
| --- | --- |
| Capteur ou actionneur sur mesure (DIY) | ESPHome |
| Prise/interrupteur du commerce à libérer du cloud | Tasmota |
| Capter du 433 MHz, du BLE ou de l'infrarouge | OpenMQTTGateway |
| Objets Zigbee / Z-Wave | [[01-zigbee2mqtt-zwavejs\|Zigbee2MQTT, Z-Wave JS UI]] |

Commandes : [[90-aide-memoire|aide-mémoire]].

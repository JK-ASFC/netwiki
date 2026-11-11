---
title: Home Assistant, openHAB et Domoticz
description: Plates-formes de domotique auto-hébergées — Home Assistant (Python : intégrations très nombreuses, modes d'installation OS/Supervised/Container/Core, add-ons, automatisations, tableau de bord Lovelace, API et MQTT, port 8123, HACS) ; openHAB (Java : Things/Items/Rules, moteur de règles, bindings, interface MainUI, port 8080) ; Domoticz (C++, léger, idéal Raspberry Pi, matériel Z-Wave/RFXCOM, port 8080) ; place de MQTT, sécurité (réseau IoT isolé, sauvegardes) et choix.
tags: [domotique, home assistant, openhab, domoticz, mqtt, zigbee, automatisation, iot]
icon: house-plug
---

La **domotique** auto-hébergée centralise capteurs et actionneurs (éclairage, chauffage, volets, prises, caméras) sur un serveur local, sans dépendre du cloud d'un fabricant. Les données restent chez soi et les automatisations continuent de fonctionner même sans Internet.

## Home Assistant

De loin le plus répandu, avec des **milliers d'intégrations**. Il se décline en plusieurs installations :

| Mode | Contenu | Add-ons |
| --- | --- | --- |
| **Home Assistant OS** | Système complet (sur Pi, mini-PC, VM) | Oui (supervisés) |
| **Supervised** | Sur un Debian existant | Oui |
| **Container** | Image Docker `homeassistant` | Non |
| **Core** | Dans un environnement Python | Non |

```bash
docker run -d --name homeassistant --restart unless-stopped --privileged \
  -e TZ=Europe/Paris -v /srv/homeassistant:/config \
  --network host ghcr.io/home-assistant/home-assistant:stable
# Interface : http://serveur:8123 (assistant de création du compte au premier lancement)
```

- **Automatisations** par l'interface ou en YAML ; scripts, scènes, modèles Jinja.
- Tableau de bord **Lovelace** personnalisable ; application mobile (présence, notifications).
- **HACS** (dépôt communautaire) ajoute intégrations et cartes non officielles.
- S'appuie souvent sur **MQTT** (voir [[05-mosquitto/01-presentation-configuration|Mosquitto]]) et sur des passerelles comme [[06-zigbee-zwave/01-zigbee2mqtt-zwavejs|Zigbee2MQTT]].
- Le format OS/Supervised permet les **sauvegardes intégrées** (snapshots) et la gestion des add-ons ; en mode Container, sauvegarder le dossier `/config`.

## openHAB

**openHAB** (Java, Eclipse) est apprécié pour son **moteur de règles** puissant et son indépendance vis-à-vis des fabricants. Son modèle : des **Things** (équipements) exposent des **Channels** reliés à des **Items** (points de donnée) manipulés par les règles.

```bash
docker run -d --name openhab --restart unless-stopped \
  -v /srv/openhab/conf:/openhab/conf -v /srv/openhab/userdata:/openhab/userdata -v /srv/openhab/addons:/openhab/addons \
  -e OPENHAB_HTTP_PORT=8080 --network host openhab/openhab:latest
# Interface MainUI : http://serveur:8080
```

- **Bindings** pour les protocoles et marques (KNX, Modbus, Z-Wave, Zigbee, MQTT…).
- Règles en interface, DSL, **JavaScript** ou Blockly ; persistance (InfluxDB, RRD4J) pour l'historique.
- Console Karaf (`openhab-cli console`) pour l'administration avancée.

## Domoticz

**Domoticz** (C++) est **léger** et rapide, adapté à un Raspberry Pi modeste. Il gère nativement beaucoup de matériel **Z-Wave**, **RFXCOM**, 433 MHz, et MQTT. Interface plus datée mais efficace pour un usage ciblé.

```bash
docker run -d --name domoticz -p 127.0.0.1:8080:8080 -p 127.0.0.1:6144:6144 \
  -v /srv/domoticz:/config domoticz/domoticz:stable
```

Automatisations par l'interface (interrupteurs virtuels, minuteries) ou scripts **Lua**/dzVents ; extensible par Python.

## Sécurité

> [!WARNING]
> Les objets connectés sont souvent peu sûrs et mal mis à jour. Les placer sur un **réseau (VLAN) isolé**, bloquer leur accès à Internet quand il est inutile, et ne pas exposer l'interface de domotique directement : passer par un [[08-acces-distant-vpn/03-wireguard/01-presentation-installation|VPN]] ou un proxy authentifié. Activer HTTPS, des comptes nominatifs, et **sauvegarder** régulièrement la configuration (perdre ses automatisations et l'appairage Zigbee/Z-Wave est très pénible).

## Choisir

| Besoin | Outil |
| --- | --- |
| Écosystème le plus riche, communauté, application mobile | Home Assistant |
| Moteur de règles avancé, indépendance, KNX/Modbus | openHAB |
| Installation légère, matériel Z-Wave/433 MHz, Raspberry Pi | Domoticz |

Voir aussi : [[05-plateformes-iot/01-thingsboard-mainflux|plates-formes IoT]] · [[06-zigbee-zwave/01-zigbee2mqtt-zwavejs|Zigbee et Z-Wave]]. Commandes : [[90-aide-memoire|aide-mémoire]].

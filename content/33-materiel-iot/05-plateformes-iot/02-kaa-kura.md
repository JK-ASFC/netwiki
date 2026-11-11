---
title: Kaa et Eclipse Kura
description: Kaa IoT (plate-forme IoT à base de microservices et de blueprints, édition communautaire limitée, modèle largement orienté offre cloud) et Eclipse Kura (passerelle IoT Java/OSGi pour l'« edge » : exécutée sur une passerelle de terrain, pilotes de terrain Modbus/OPC-UA/S7, cloud connectors MQTT, interface web d'administration, port 443, conteneurs, lien avec Eclipse Kapua) ; rôle d'une passerelle de périphérie et choix.
tags: [kaa, eclipse kura, iot, passerelle, edge, modbus, opc-ua, osgi, mqtt]
icon: radio-tower
---

## Kaa IoT

**Kaa** est une plate-forme IoT organisée en **microservices** et en **blueprints** (modèles d'application) : gestion des appareils, collecte, tableaux de bord, règles.

> [!NOTE]
> Kaa est aujourd'hui surtout proposé en **offre cloud** commerciale. L'édition communautaire auto-hébergeable est **limitée** et son installation libre est moins documentée que par le passé (l'ancienne « Kaa IoT Platform » open source n'est plus activement développée sous la même forme). Vérifier précisément ce qui est disponible en auto-hébergement avant de la retenir ; pour une plate-forme libre complète, [[01-thingsboard-mainflux|ThingsBoard]] est un choix plus sûr.

## Eclipse Kura

**Eclipse Kura** n'est pas une plate-forme centrale mais une **passerelle IoT de périphérie** (*edge gateway*) : un cadre **Java/OSGi** installé sur une passerelle de terrain (boîtier industriel, Raspberry Pi) qui collecte les données des équipements locaux et les remonte vers une plate-forme (ThingsBoard, Kapua, un cloud) en **MQTT**.

| Fonction | Détail |
| --- | --- |
| Pilotes de terrain | **Modbus**, **OPC-UA**, S7, MQTT, GPIO, série, Bluetooth |
| Cloud connectors | MQTT vers Eclipse Kapua, AWS IoT, Azure IoT, autres |
| Wires | Chaînes de traitement graphiques (acquisition → filtre → publication) |
| Réseau | Gestion des interfaces, pare-feu, VPN, 3G/4G de la passerelle |
| Administration | Interface web (port 443), conteneurs applicatifs OSGi |

```bash
# Image Docker de démonstration (ou paquet pour la passerelle réelle)
docker run -d --name kura -p 127.0.0.1:443:443 eclipse/kura:latest
# Interface : https://serveur (compte admin par défaut à changer)
```

**Eclipse Kapua** est la plate-forme serveur associée (gestion de flottes de passerelles Kura) ; ensemble, ils forment une chaîne edge-to-cloud entièrement open source.

### Rôle d'une passerelle de périphérie

Entre des équipements industriels (souvent sur des bus Modbus/OPC-UA, sans IP routable) et le système central, la passerelle :

- **traduit** les protocoles de terrain vers MQTT/IP ;
- **filtre et agrège** localement (moins de données remontées) ;
- **continue** de fonctionner si le lien vers le central tombe (tampon local) ;
- **isole** le réseau industriel du réseau IT.

## Choisir

| Besoin | Outil |
| --- | --- |
| Plate-forme IoT centrale open source | [[01-thingsboard-mainflux\|ThingsBoard]], Magistrala |
| Passerelle de terrain Modbus/OPC-UA vers MQTT | Eclipse Kura |
| Gestion de flottes de passerelles Kura | Eclipse Kapua |
| Plate-forme principalement cloud | Kaa (vérifier l'auto-hébergement) |

Commandes : [[90-aide-memoire|aide-mémoire]].

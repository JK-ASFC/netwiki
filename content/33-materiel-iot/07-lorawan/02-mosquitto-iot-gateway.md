---
title: Eclipse Mosquitto (IoT) et ThingsBoard IoT Gateway
description: Le courtier MQTT Eclipse Mosquitto comme colonne vertébrale d'une installation IoT (sujets, QoS, rétention, pont vers une plate-forme, authentification et ACL, TLS) et ThingsBoard IoT Gateway (passerelle Python qui relie des équipements Modbus, OPC-UA, BACnet, CAN, requêtes, MQTT externe à une plate-forme ThingsBoard, connecteurs et configuration) ; rôle d'une passerelle d'intégration et renvois vers les pages existantes.
tags: [mosquitto, mqtt, thingsboard gateway, passerelle, iot, modbus, opc-ua, intégration]
icon: radio
---

## Eclipse Mosquitto dans une installation IoT

**Eclipse Mosquitto** est le courtier **MQTT** léger de référence. Il est déjà présenté en détail dans le wiki — voir **[[05-mosquitto/01-presentation-configuration|Mosquitto (MQTT)]]**. Dans un contexte IoT, il joue le rôle de **colonne vertébrale de messagerie** entre capteurs, passerelles et plates-formes :

| Usage IoT | Détail |
| --- | --- |
| Point de collecte local | Les capteurs et passerelles publient sur des **sujets** (`usine/ligne1/temp`) |
| Découplage | Plusieurs consommateurs (plate-forme, supervision, archivage) s'abonnent indépendamment |
| **Pont** (*bridge*) | Mosquitto local relié à un courtier central ou à une plate-forme ([[05-plateformes-iot/01-thingsboard-mainflux\|ThingsBoard]]) |
| QoS et rétention | Fiabilité de livraison, dernière valeur connue, messages de volonté (*last will*) |
| Sécurité | Authentification par mot de passe, **ACL** par sujet, **TLS**, à activer avant toute exposition |

Rappel de configuration d'un **pont** (relayer les données locales vers un courtier central) :

```text /etc/mosquitto/conf.d/pont.conf
connection pont-central
address mqtt-central.exemple.fr:8883
bridge_cafile /etc/mosquitto/ca.crt
remote_username passerelle-lyon
remote_password …
topic usine/# out 1 "" ""
```

Pour les autres courtiers MQTT (EMQX, VerneMQ, NanoMQ, HiveMQ CE), voir les pages correspondantes du chapitre Recherche et files de messages.

## ThingsBoard IoT Gateway

La **ThingsBoard IoT Gateway** (Apache 2.0) est une **passerelle d'intégration** en Python : installée près des équipements, elle traduit leurs protocoles vers la plate-forme **ThingsBoard** (ou tout MQTT) et gère la connexion montante.

| Connecteur | Équipements |
| --- | --- |
| **Modbus** | Automates, compteurs, variateurs |
| **OPC-UA** | Supervision industrielle |
| **BACnet** | GTB, chauffage/ventilation |
| **MQTT** | Capteurs ou courtiers externes (mappage de sujets) |
| **Requêtes** (REST, SNMP, série, CAN, ODBC) | Sources variées |

```bash
docker run -d --name tb-gateway --restart always \
  -v /srv/tb-gateway/config:/thingsboard_gateway/config \
  -v /srv/tb-gateway/extensions:/thingsboard_gateway/extensions \
  thingsboard/tb-gateway
```

```json tb_gateway.json (extrait)
{
  "thingsboard": { "host": "thingsboard.exemple.fr", "port": 1883,
    "security": { "accessToken": "JETON_DE_LA_PASSERELLE" } },
  "connectors": [ { "name": "Modbus", "type": "modbus", "configuration": "modbus.json" } ]
}
```

Chaque connecteur a son fichier (`modbus.json`, `opcua.json`…) décrivant les équipements, les registres lus et leur **mappage** vers des clés de télémétrie et des attributs ThingsBoard. La passerelle met en **tampon** les données en cas de coupure du lien montant.

## Rôle d'une passerelle d'intégration

Entre un réseau d'équipements hétérogènes (bus industriels, protocoles propriétaires) et une plate-forme IoT, la passerelle :

- parle les **protocoles de terrain** que la plate-forme ne connaît pas ;
- **normalise** les données vers un modèle unique ;
- réduit le trafic (agrégation, filtrage) ;
- **isole** le réseau industriel du réseau IT.

C'est le même rôle qu'[[05-plateformes-iot/02-kaa-kura|Eclipse Kura]], côté ThingsBoard et en Python plutôt qu'en Java/OSGi.

Commandes : [[90-aide-memoire|aide-mémoire]].

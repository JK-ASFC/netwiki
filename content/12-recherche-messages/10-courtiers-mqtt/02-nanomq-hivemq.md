---
title: NanoMQ et HiveMQ CE
description: NanoMQ (C, MIT, projet de l'équipe EMQX) pour la périphérie — MQTT 3.1.1/5.0, QUIC, pont vers un courtier central, nanomq.conf, nanomq_cli, faible empreinte ; HiveMQ Community Edition (Java, Apache 2.0) — installation, config.xml (écouteurs), extensions (sécurité fichier RBAC), limites face à l'édition commerciale ; comparatif des courtiers MQTT du wiki.
tags: [nanomq, hivemq, mqtt, iot, edge, courtier, pont mqtt]
icon: radio
---

## NanoMQ

**NanoMQ** est un courtier MQTT très léger en C, conçu pour la **périphérie** (passerelle industrielle, Raspberry Pi, routeur) : quelques Mo de mémoire, multi-cœur, prise en charge de **MQTT sur QUIC**. Son rôle typique : collecter localement les capteurs puis **relayer** vers un courtier central (EMQX, autre MQTT ou cloud).

```bash
docker run -d --name nanomq -p 1883:1883 -p 8083:8083 -p 8081:8081 emqx/nanomq:latest
# Paquets : dépôt du projet pour Debian/Ubuntu, RPM, ou compilation (cmake)
```

| Port | Usage |
| --- | --- |
| 1883 | MQTT |
| 8883 | MQTT sur TLS |
| 8083 | MQTT sur WebSocket |
| 8081 | API HTTP |

```text /etc/nanomq.conf
mqtt { max_packet_size = 1KB, keepalive_multiplier = 1.25 }
listeners.tcp { bind = "0.0.0.0:1883" }
auth {
  allow_anonymous = false
  password = { include "/etc/nanomq_pwd.conf" }
  acl = { include "/etc/nanomq_acl.conf" }
}
bridges.mqtt.central {
  server = "mqtt-tls://mqtt.exemple.fr:8883"
  clientid = "passerelle-lyon"
  username = "passerelle"
  password = "…"
  forwards = [ { remote_topic = "usine/lyon/#", local_topic = "capteurs/#", qos = 1 } ]
  ssl { cacertfile = "/etc/nanomq/ca.pem" }
}
```

```bash
nanomq start --conf /etc/nanomq.conf
nanomq_cli pub -t capteurs/temp -m 21.5 -q 1
nanomq_cli sub -t "capteurs/#"
```

## HiveMQ Community Edition

**HiveMQ CE** est la version libre du courtier Java **HiveMQ** : MQTT 3.x et 5 complets, un seul nœud, système d'**extensions** Java. La grappe, la console de contrôle et les extensions d'entreprise sont réservées à l'édition commerciale.

```bash
docker run -d --name hivemq -p 1883:1883 hivemq/hivemq-ce
# ou archive ZIP : bin/run.sh (Java 11 ou plus)
```

```xml conf/config.xml
<hivemq>
  <listeners>
    <tcp-listener><port>1883</port><bind-address>0.0.0.0</bind-address></tcp-listener>
    <tls-tcp-listener>
      <port>8883</port><bind-address>0.0.0.0</bind-address>
      <tls>
        <keystore><path>/opt/hivemq/conf/serveur.jks</path><password>…</password><private-key-password>…</private-key-password></keystore>
      </tls>
    </tls-tcp-listener>
  </listeners>
</hivemq>
```

Par défaut, **tout client est accepté** : installer l'extension **File RBAC** (comptes et droits par sujets dans un fichier XML) ou une extension d'authentification avant toute ouverture réseau.

## Comparatif

| Courtier | Langage | Points forts | Grappe libre |
| --- | --- | --- | --- |
| Mosquitto | C | Simple, partout, ponts | Non |
| EMQX | Erlang | Très grande échelle, moteur de règles, console | Selon licence de la version |
| VerneMQ | Erlang | Grappe sans maître | Oui |
| NanoMQ | C | Périphérie, QUIC, pont | Non (conçu pour un nœud) |
| HiveMQ CE | Java | MQTT 5 complet, extensions | Non |

Voir aussi : [[01-vernemq|VerneMQ]]. Commandes : [[90-aide-memoire|aide-mémoire]].

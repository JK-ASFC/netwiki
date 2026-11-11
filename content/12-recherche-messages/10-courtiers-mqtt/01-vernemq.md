---
title: VerneMQ
description: VerneMQ, courtier MQTT distribué écrit en Erlang/OTP (Apache 2.0) — MQTT 3.1, 3.1.1 et 5.0, grappe sans maître, installation (paquets, Docker), vernemq.conf (écouteurs, TLS, WebSocket), authentification par fichier (vmq-passwd, vmq-acl) ou base de données (vmq_diversity), greffons, commandes vmq-admin (cluster, session, listener, metrics), métriques Prometheus et état du projet.
tags: [vernemq, mqtt, iot, erlang, courtier, grappe]
icon: radio
---

**VerneMQ** est un courtier **MQTT** conçu pour fonctionner en **grappe** : plusieurs nœuds partagent abonnements et sessions, sans nœud maître. Écrit en Erlang/OTP, il tient bien un grand nombre de connexions simultanées.

> [!NOTE]
> Le développement est moins actif que celui d'EMQX ou de Mosquitto, et les paquets binaires officiels sont réservés aux souscripteurs depuis quelques versions ; l'image Docker et la compilation depuis les sources restent possibles. Vérifier l'état du projet avant un nouveau déploiement.

## Installation

```bash
docker run -d --name vernemq -p 1883:1883 -p 8888:8888 \
  -e DOCKER_VERNEMQ_ACCEPT_EULA=yes \
  -e DOCKER_VERNEMQ_ALLOW_ANONYMOUS=off \
  vernemq/vernemq
```

| Port | Usage |
| --- | --- |
| 1883 | MQTT |
| 8883 | MQTT sur TLS |
| 8080 | MQTT sur WebSocket |
| 8888 | HTTP : métriques (`/metrics`), état, API |
| 44053 | Distribution des messages entre nœuds |

## Configuration

```text /etc/vernemq/vernemq.conf
accept_eula = yes
allow_anonymous = off
listener.tcp.default = 0.0.0.0:1883
listener.ssl.default = 0.0.0.0:8883
listener.ssl.cafile = /etc/vernemq/tls/ca.pem
listener.ssl.certfile = /etc/vernemq/tls/serveur.pem
listener.ssl.keyfile = /etc/vernemq/tls/serveur.key
listener.ws.default = 0.0.0.0:8080
listener.http.default = 127.0.0.1:8888
plugins.vmq_passwd = on
plugins.vmq_acl = on
vmq_passwd.password_file = /etc/vernemq/vmq.passwd
vmq_acl.acl_file = /etc/vernemq/vmq.acl
nodename = VerneMQ@10.0.0.11
distributed_cookie = <secret partagé par les nœuds>
```

```bash
vmq-passwd -c /etc/vernemq/vmq.passwd capteur01       # crée le fichier et l'utilisateur
cat > /etc/vernemq/vmq.acl <<'FIN'
user capteur01
topic write usine/lyon/#
user tableau
topic read usine/#
FIN
```

Pour des comptes en base, le greffon **vmq_diversity** interroge PostgreSQL, MySQL, Redis ou MongoDB via des scripts Lua.

## Exploitation

```bash
vmq-admin cluster join discovery-node=VerneMQ@10.0.0.11   # depuis un nouveau nœud
vmq-admin cluster show
vmq-admin session show --client_id --is_online --topic
vmq-admin listener show
vmq-admin plugin show
vmq-admin metrics show | grep -E 'mqtt_publish_received|socket_open'
vmq-admin set allow_anonymous=off                          # réglage à chaud
```

Voir aussi : [[02-nanomq-hivemq|NanoMQ et HiveMQ CE]] · Mosquitto et EMQX dans ce chapitre. Commandes : [[90-aide-memoire|aide-mémoire]].

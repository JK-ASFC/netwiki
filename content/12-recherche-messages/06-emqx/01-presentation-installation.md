---
title: Présentation et installation
description: EMQX, broker MQTT distribué — architecture (cluster Erlang, nœuds cœur et réplicas), fonctions (MQTT 5, MQTT sur QUIC, moteur de règles, intégrations de données, tableau de bord), licence, ports, installation sous Debian/Ubuntu, RHEL, macOS et Docker, sécurisation du tableau de bord et premiers tests.
tags: [emqx, mqtt, iot, cluster, installation, tableau de bord]
icon: info
---

**EMQX** est un broker MQTT conçu pour la **montée en charge** : un cluster de quelques nœuds gère des millions de connexions simultanées. Il ajoute à MQTT un **moteur de règles** SQL et des **intégrations** vers Kafka, bases de données, HTTP, ce qui en fait une plate-forme IoT complète, là où [[05-mosquitto/01-presentation-configuration|Mosquitto]] reste un broker unique et léger.

## Architecture et fonctions

| Élément | Description |
| --- | --- |
| Cluster | Nœuds Erlang reliés ; état (routes, sessions) répliqué |
| Nœuds cœur / réplicas | Les nœuds **cœur** gèrent les métadonnées, les **réplicas** absorbent les connexions (grands clusters) |
| Protocoles | MQTT 3.1.1 / 5.0, MQTT sur WebSocket, **MQTT sur QUIC**, passerelles (CoAP, LwM2M, STOMP) |
| Authentification | Base intégrée, LDAP, HTTP, JWT, MySQL/PostgreSQL/Redis, certificats |
| Autorisation | Fichier ACL, base intégrée, sources externes |
| **Moteur de règles** | Requêtes SQL sur les messages (filtrage, transformation) |
| **Intégrations** | Kafka, PostgreSQL, InfluxDB, Elasticsearch, HTTP/webhook, S3… |
| Tableau de bord | Interface web de supervision et d'administration |

## Licence

Depuis la version **5.9**, EMQX est distribué en une édition unique sous **Business Source License** : certaines utilisations (notamment en cluster de production) sont soumises à une licence commerciale. Vérifiez les conditions de la version que vous déployez ; les versions antérieures existaient en édition *Open Source* (Apache 2.0) et *Enterprise*.

## Ports

| Port | Usage |
| --- | --- |
| **1883** / **8883** | MQTT / MQTT sur TLS |
| 8083 / 8084 | MQTT sur WebSocket / WebSocket TLS |
| 14567 (UDP) | MQTT sur QUIC |
| **18083** | Tableau de bord et API REST |
| 4370, 5370 | Communication entre nœuds du cluster |

## Installation

```bash
# Debian / Ubuntu (dépôt officiel)
curl -s https://assets.emqx.com/scripts/install-emqx-deb.sh | sudo bash
sudo apt install emqx
# RHEL / Rocky / Alma
curl -s https://assets.emqx.com/scripts/install-emqx-rpm.sh | sudo bash
sudo dnf install emqx

sudo systemctl enable --now emqx
sudo emqx ctl status
```

| Plate-forme | Installation |
| --- | --- |
| macOS | `brew install emqx && emqx start` |
| Docker | `docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8883:8883 -p 18083:18083 emqx/emqx:5.8` |
| Kubernetes | Opérateur EMQX |
| Windows | Pas de version native récente : Docker / WSL |

## Premiers pas

1. Ouvrir `http://serveur:18083` : identifiants initiaux **admin / public** → **changer immédiatement** le mot de passe.
2. *Access Control → Authentication* : créer une source (base intégrée, LDAP…) — sans elle, les clients anonymes sont acceptés.
3. *Access Control → Authorization* : définir les ACL, et `authorization.no_match = deny`.
4. *Management → Listeners* : activer TLS (8883), désactiver les listeners inutiles.

```bash
sudo emqx ctl admins passwd admin 'NouveauMotDePasseLong!'
mosquitto_sub -h emqx1.corp.exemple.fr -p 1883 -u test -P '…' -t 'essais/#' -v
```

## Suite

[[02-configuration-cluster-exploitation|Configuration, cluster, règles et exploitation]]

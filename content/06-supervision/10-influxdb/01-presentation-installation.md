---
title: Présentation et installation
description: InfluxDB, base de séries temporelles — modèle de données (mesures, étiquettes, champs, horodatage), versions 1.x (InfluxQL), 2.x (Flux, buckets, tokens) et 3 (Core et Enterprise, SQL), choix de version, installation sous Linux, Windows, macOS et Docker, initialisation, organisations, buckets, jetons et rétention.
tags: [influxdb, séries temporelles, influxql, flux, sql, installation, buckets, tokens]
icon: info
---

**InfluxDB** (InfluxData) stocke des **séries temporelles** : mesures horodatées (métriques d'infrastructure, capteurs IoT, données industrielles). Associée à [[09-telegraf/01-presentation-configuration|Telegraf]] et [[03-grafana/01-presentation-installation|Grafana]], elle forme la pile **TIG**.

## Modèle de données

```text Protocole « line protocol »
interface,hote=r1-paris,ifName=Gi0/0/0 in_octets=8341234567i,out_octets=2234500012i,oper_status=1i 1761728400000000000
```

| Élément | Rôle |
| --- | --- |
| **Mesure** (*measurement*) | Équivalent d'une table (`interface`, `cpu`) |
| **Étiquettes** (*tags*) | Métadonnées indexées (hôte, site, interface) : filtres et regroupements ; attention à la cardinalité |
| **Champs** (*fields*) | Valeurs (entiers, flottants, booléens, chaînes) |
| Horodatage | En nanosecondes par défaut |

## Versions

| Version | Langage | Organisation | Remarques |
| --- | --- | --- | --- |
| **1.x** (1.11) | InfluxQL (proche de SQL) | Bases + politiques de rétention | Toujours très répandue ; maintenance |
| **2.x** (2.7) | **Flux** + InfluxQL (compatibilité) | Organisations, **buckets**, **jetons** | Interface web intégrée ; Flux est en maintenance (pas d'évolution) |
| **3** (Core, Enterprise, 2025) | **SQL** + InfluxQL | Bases | Nouveau moteur (Apache Arrow, Parquet, stockage objet) ; *Core* libre, *Enterprise* commerciale (HA, compaction longue durée) |

**Choix** : pour un nouveau déploiement, InfluxDB 3 (SQL, stockage objet) ou une alternative compatible Prometheus (VictoriaMetrics) ; pour une pile Telegraf/Grafana existante, la 2.x reste un choix stable. Vérifiez la compatibilité des outils (sorties Telegraf, sources Grafana) avec la version visée.

## Installation (2.x)

```bash
# Dépôt InfluxData (voir l'article Telegraf pour l'ajout de la clé et du dépôt)
sudo apt install influxdb2 influxdb2-cli
sudo systemctl enable --now influxdb
influx setup --org exemple --bucket infrastructure --username admin \
  --password 'MotDePasseLong!' --retention 90d --force
```

| Plate-forme | Installation |
| --- | --- |
| RHEL | `dnf install influxdb2 influxdb2-cli` (dépôt InfluxData) |
| Windows | Archive ZIP (`influxd.exe`), service via NSSM |
| macOS | `brew install influxdb influxdb-cli` |
| Docker | `docker run -d -p 8086:8086 -v influx-data:/var/lib/influxdb2 -e DOCKER_INFLUXDB_INIT_MODE=setup -e DOCKER_INFLUXDB_INIT_USERNAME=admin -e DOCKER_INFLUXDB_INIT_PASSWORD=… -e DOCKER_INFLUXDB_INIT_ORG=exemple -e DOCKER_INFLUXDB_INIT_BUCKET=infrastructure influxdb:2` |

Interface web et API : port **8086** (à publier en HTTPS : `tls-cert`/`tls-key` dans `/etc/influxdb/config.toml` ou reverse proxy).

## InfluxDB 3 Core

```bash
docker run -d --name influxdb3 -p 8181:8181 -v influx3-data:/var/lib/influxdb3 \
  influxdb:3-core influxdb3 serve --node-id noeud1 --object-store file --data-dir /var/lib/influxdb3
docker exec influxdb3 influxdb3 create token --admin
```

Port **8181** ; requêtes en SQL (`influxdb3 query --database infrastructure "SELECT …"`).

## Buckets, jetons et rétention (2.x)

```bash
influx bucket create --name reseau --retention 400d --org exemple
influx bucket list
# Jeton en écriture seule pour Telegraf (bucket précis)
influx auth create --org exemple --description "telegraf-paris" \
  --write-bucket $(influx bucket list --name reseau --hide-headers | cut -f1)
# Jeton en lecture pour Grafana
influx auth create --org exemple --description "grafana" --read-buckets
influx auth list
```

Donnez à chaque collecteur et à chaque outil de lecture un **jeton dédié** aux droits minimaux ; le jeton *operator* créé par `setup` est réservé à l'administration.

## Suite

[[02-requetes-exploitation|Requêtes, sous-échantillonnage et exploitation]]

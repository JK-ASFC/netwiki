---
title: Présentation, installation et exploitation
description: ClickHouse — base analytique en colonnes open source (Apache 2.0) pour journaux, métriques, traces et analytique web : installation (dépôt officiel pour Debian/Ubuntu et RHEL, script clickhouse.com, macOS, Docker ; Windows via WSL ou Docker), ports (8123 HTTP, 9000 natif, 9440 TLS), utilisateurs et profils (users.d, SQL RBAC), moteurs MergeTree (partitions, ORDER BY, TTL), types et compression, requêtes et agrégations, ingestion (clickhouse-client, Kafka, Vector), réplication et sharding avec ClickHouse Keeper, sauvegarde BACKUP TO S3, tables système et interface Play.
tags: [clickhouse, olap, colonnes, analytique, journaux, mergetree, observabilité]
icon: info
---

**ClickHouse** agrège des milliards de lignes en quelques centaines de millisecondes grâce au stockage **en colonnes** compressé. C'est un moteur de choix pour stocker **journaux**, **flux NetFlow**, métriques ou traces à grande échelle (plusieurs plates-formes d'observabilité — SigNoz, Uptrace, HyperDX — reposent dessus).

| Port | Usage |
| --- | --- |
| **8123** | HTTP (requêtes, interface Play `/play`, tableaux de bord `/dashboard`) |
| **9000** | Protocole natif (`clickhouse-client`) |
| 8443 / 9440 | Variantes TLS |
| 9009, 9181 | Réplication interserveurs, ClickHouse Keeper |

## Installation

```bash
# Debian/Ubuntu
sudo apt install -y apt-transport-https ca-certificates curl gnupg
curl -fsSL 'https://packages.clickhouse.com/rpm/lts/repodata/repomd.xml.key' | sudo gpg --dearmor -o /usr/share/keyrings/clickhouse-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/clickhouse-keyring.gpg] https://packages.clickhouse.com/deb stable main" | sudo tee /etc/apt/sources.list.d/clickhouse.list
sudo apt update && sudo apt install -y clickhouse-server clickhouse-client   # demande le mot de passe de « default »
sudo systemctl enable --now clickhouse-server
```

RHEL : dépôt `https://packages.clickhouse.com/rpm/clickhouse.repo` puis `dnf install clickhouse-server clickhouse-client`. Tous systèmes Unix : `curl https://clickhouse.com/ | sh` (binaire unique). macOS : `brew install --cask clickhouse`. Docker : `clickhouse/clickhouse-server`.

Configuration : `/etc/clickhouse-server/config.d/*.xml` (écoute : `<listen_host>0.0.0.0</listen_host>`) et `users.d/*.xml` ; préférez la gestion des utilisateurs en **SQL** (`access_management` activé).

## Tables et requêtes

```sql
CREATE USER analyste IDENTIFIED WITH sha256_password BY 'MdpAnalyse2026' HOST IP '10.0.0.0/8';
GRANT SELECT ON reseau.* TO analyste;

CREATE DATABASE reseau;
CREATE TABLE reseau.flux (
  ts DateTime CODEC(Delta, ZSTD), src IPv4, dst IPv4, dport UInt16, proto LowCardinality(String),
  octets UInt64, paquets UInt32, equipement LowCardinality(String)
) ENGINE = MergeTree
PARTITION BY toYYYYMMDD(ts)
ORDER BY (equipement, ts)
TTL ts + INTERVAL 90 DAY;

SELECT dst, sum(octets) AS volume FROM reseau.flux
WHERE ts > now() - INTERVAL 1 HOUR GROUP BY dst ORDER BY volume DESC LIMIT 10;
```

```bash
clickhouse-client --password -q "INSERT INTO reseau.flux FORMAT CSVWithNames" < flux.csv
clickhouse-client --password -q "SELECT count() FROM reseau.flux"
```

Ingestion continue : moteur de table **Kafka** + vue matérialisée, ou agents comme Vector et [[03-fluent-bit/01-presentation-installation|Fluent Bit]].

## Haute disponibilité et sauvegarde

- Réplication : moteur `ReplicatedMergeTree` coordonné par **ClickHouse Keeper** (remplaçant intégré de ZooKeeper, 3 nœuds), tables `Distributed` pour le sharding.
- Sauvegarde : `BACKUP DATABASE reseau TO S3('https://minio.corp.exemple.fr/sauv/ch/2026-11-02', 'acces', 'secret');` puis `RESTORE`.
- Diagnostic : tables `system.query_log`, `system.parts`, `system.merges`, `system.replicas`.

<!-- CAPTURE: ClickHouse — interface Play (requête SQL dans le navigateur) | _assets/clickhouse-play.png -->
<!-- CAPTURE: ClickHouse — tableau de bord intégré /dashboard | _assets/clickhouse-dashboard.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

---
title: Apache Doris
description: Apache Doris — base OLAP MPP temps réel compatible avec le protocole MySQL (Apache 2.0) : architecture (Frontend FE, Backend BE, ou mode découplé stockage/calcul), installation (archives binaires Linux, Docker, déploiement de cluster), ports (8030 FE web, 9030 MySQL), modèles de tables (Duplicate, Unique, Aggregate), partitions et buckets, ingestion (Stream Load, Routine Load depuis Kafka, Broker Load, INSERT), catalogues externes (Hive, Iceberg, JDBC), requêtes, gestion des utilisateurs et supervision.
tags: [apache doris, olap, mpp, mysql, temps réel, kafka]
icon: info
---

**Apache Doris** répond en SQL compatible [[01-mariadb-mysql/01-presentation|MySQL]] (port **9030**) sur de gros volumes ingérés en continu, pour des tableaux de bord et analyses interactives. Son dérivé commercial est VeloDB ; StarRocks est un fork proche.

| Composant | Rôle |
| --- | --- |
| **FE** (Frontend) | Métadonnées, planification, protocole MySQL ; 1 ou 3 (haute disponibilité) |
| **BE** (Backend) | Stockage en colonnes et exécution ; 3+ en production |

## Installation (Linux)

```bash
# Archive binaire depuis doris.apache.org (Java 17 requis)
tar xzf apache-doris-*-bin-x64.tar.gz -C /opt && cd /opt/apache-doris-*
echo 'priority_networks = 10.0.20.0/24' >> fe/conf/fe.conf && fe/bin/start_fe.sh --daemon
echo 'priority_networks = 10.0.20.0/24' >> be/conf/be.conf && be/bin/start_be.sh --daemon   # vm.max_map_count=2000000, swap désactivé
mysql -h 10.0.20.211 -P 9030 -u root -e "ALTER SYSTEM ADD BACKEND '10.0.20.212:9050'; SHOW BACKENDS\G"
```

Docker : images `apache/doris` (fe et be). Windows et macOS : clients MySQL uniquement.

## Tables et ingestion

```sql
SET PASSWORD FOR 'root' = PASSWORD('MdpDoris2026');
CREATE DATABASE reseau;
CREATE TABLE reseau.flux (ts DATETIME, equipement VARCHAR(64), dst VARCHAR(45), octets BIGINT)
DUPLICATE KEY(ts, equipement)
PARTITION BY RANGE(ts) ()
DISTRIBUTED BY HASH(equipement) BUCKETS 8
PROPERTIES ("dynamic_partition.enable" = "true", "dynamic_partition.time_unit" = "DAY", "dynamic_partition.end" = "3", "dynamic_partition.start" = "-90", "dynamic_partition.prefix" = "p");
CREATE ROUTINE LOAD reseau.flux_kafka ON flux COLUMNS TERMINATED BY ","
FROM KAFKA ("kafka_broker_list" = "10.0.20.221:9092", "kafka_topic" = "netflow");
```

```bash
curl --location-trusted -u root:"$MDP" -H "column_separator:," -T flux.csv http://10.0.20.211:8030/api/reseau/flux/_stream_load
```

Interface : `http://<fe>:8030` ([[04-interface-graphique|interfaces graphiques]]). Suite : [[02-apache-pinot|Pinot]] · [[03-apache-druid|Druid]] · [[90-aide-memoire|aide-mémoire]].

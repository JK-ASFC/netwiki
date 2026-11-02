---
title: Présentation, installation et utilisation
description: QuestDB — base de séries temporelles open source (Apache 2.0) écrite en Java et C++ : installation (Docker, Homebrew, archive avec runtime Linux et Windows), ports (9000 console web et REST, 9009 ILP TCP, 8812 protocole PostgreSQL, 9003 santé), configuration server.conf, ingestion par InfluxDB Line Protocol (HTTP /write, TCP, Telegraf), SQL étendu (timestamp désigné, PARTITION BY, SAMPLE BY, LATEST ON, ASOF JOIN), rétention par partitions, authentification et console web.
tags: [questdb, séries temporelles, ilp, influxdb line protocol, sql, telegraf]
icon: info
---

**QuestDB** ingère des millions de points par seconde et les interroge en **SQL** enrichi pour le temps. Il accepte le protocole d'écriture d'[[10-influxdb/01-presentation-installation|InfluxDB]] (ILP) : [[09-telegraf/01-presentation-configuration|Telegraf]] ou des scripts existants peuvent l'alimenter sans modification.

| Port | Usage |
| --- | --- |
| **9000** | Console web, API REST, ILP sur HTTP (`/write`) |
| 9009 | ILP sur TCP |
| **8812** | Protocole PostgreSQL (psql, Grafana, pilotes) |
| 9003 | Santé et métriques Prometheus |

## Installation

```bash
docker run -d --name questdb -p 9000:9000 -p 9009:9009 -p 8812:8812 -p 9003:9003 -v /srv/questdb:/var/lib/questdb questdb/questdb
brew install questdb && questdb start          # macOS
# Linux / Windows : archive « with runtime » depuis questdb.com, puis
./questdb.sh start -d /srv/questdb             # Linux ; Windows : questdb.exe start (ou service)
```

Configuration : `<racine>/conf/server.conf` (par exemple `pg.user`, `pg.password`, `http.bind.to`, `cairo.max.uncommitted.rows`). L'édition libre propose une authentification simple (utilisateur PostgreSQL, jeton ILP) ; le contrôle d'accès fin (RBAC, TLS intégré) relève de l'édition Enterprise — publiez la console derrière un reverse proxy authentifié.

## Ingestion

```bash
curl -s -X POST 'http://localhost:9000/write' --data-binary 'interfaces,equipement=sw-coeur-01,port=Te1/0/1 in_octets=1234567i,out_octets=7654321i'
```

```toml
# Telegraf
[[outputs.influxdb_v2]]
  urls = ["http://questdb.corp.exemple.fr:9000"]
  token = ""
  content_encoding = "identity"
```

## Requêtes

```sql
CREATE TABLE interfaces (ts TIMESTAMP, equipement SYMBOL, port SYMBOL, in_octets LONG, out_octets LONG)
  TIMESTAMP(ts) PARTITION BY DAY WAL;
SELECT ts, equipement, avg(in_octets) FROM interfaces WHERE ts IN today() SAMPLE BY 5m;
SELECT * FROM interfaces LATEST ON ts PARTITION BY equipement, port;   -- dernière valeur de chaque port
ALTER TABLE interfaces DROP PARTITION WHERE ts < dateadd('M', -6, now());  -- rétention
```

<!-- CAPTURE: QuestDB — console web, éditeur SQL et graphique de résultat | _assets/questdb-console.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

---
title: CockroachDB
description: CockroachDB — base SQL distribuée compatible avec le protocole PostgreSQL (Cockroach Labs) : architecture (plages répliquées par Raft, transactions sérialisables, survie aux pannes de nœud et de zone), licence et éditions (fin de l'édition Core en 2024, licence Enterprise gratuite sous conditions), installation (binaire Linux, macOS, Windows expérimental, Docker, Kubernetes), certificats (cockroach cert), démarrage d'un cluster de trois nœuds, cockroach init, SQL (port 26257), DB Console (port 8080), localités et réplication, sauvegarde (BACKUP vers S3), mises à jour progressives.
tags: [cockroachdb, newsql, sql distribué, postgresql, raft, haute disponibilité]
icon: info
---

**CockroachDB** répartit automatiquement les données en **plages** répliquées (3 copies par défaut, consensus **Raft**) sur tous les nœuds : la base survit à la perte d'un nœud — ou d'une zone si on la déploie sur trois — sans intervention. Les applications s'y connectent comme à [[02-postgresql/01-presentation|PostgreSQL]] (pilotes PostgreSQL, port **26257**), avec quelques différences de SQL.

> [!WARNING]
> Depuis la version 24.3 (fin 2024), l'édition gratuite *Core* n'existe plus : CockroachDB est distribué sous une licence **Enterprise** gratuite pour les petites structures (sous un seuil de chiffre d'affaires, avec télémétrie obligatoire) et payante au-delà. Vérifiez les conditions en vigueur avant un déploiement.

## Installation d'un cluster sécurisé (3 nœuds)

```bash
VERSION=v24.3.5      # version courante : voir cockroachlabs.com/docs/releases
curl -fsSL "https://binaries.cockroachdb.com/cockroach-${VERSION}.linux-amd64.tgz" | tar xz
sudo cp cockroach-*/cockroach /usr/local/bin/
# Certificats (sur une machine d'administration)
cockroach cert create-ca --certs-dir=certs --ca-key=ca/ca.key
cockroach cert create-node db1.corp.exemple.fr 10.0.20.51 localhost --certs-dir=certs --ca-key=ca/ca.key   # un par nœud
cockroach cert create-client root --certs-dir=certs --ca-key=ca/ca.key
# Sur chaque nœud
cockroach start --certs-dir=certs --advertise-addr=db1.corp.exemple.fr \
  --join=db1.corp.exemple.fr,db2.corp.exemple.fr,db3.corp.exemple.fr \
  --locality=region=fr,zone=paris-a --cache=.25 --max-sql-memory=.25 --store=/srv/cockroach --background
# Une seule fois
cockroach init --certs-dir=certs --host=db1.corp.exemple.fr
```

Test rapide : `cockroach start-single-node --insecure --store=/tmp/crdb`. macOS : `brew install cockroachdb/tap/cockroach` ; Docker : `cockroachdb/cockroach` ; Kubernetes : opérateur CockroachDB.

## Utilisation

```bash
cockroach sql --certs-dir=certs --host=db1.corp.exemple.fr
```

```sql
CREATE DATABASE inventaire;
CREATE USER app WITH PASSWORD 'MdpApp2026';
GRANT ALL ON DATABASE inventaire TO app;
SHOW RANGES FROM DATABASE inventaire;
BACKUP INTO 's3://sauvegardes/crdb?AWS_ENDPOINT=https://minio.corp.exemple.fr&AWS_ACCESS_KEY_ID=…&AWS_SECRET_ACCESS_KEY=…' AS OF SYSTEM TIME '-10s';
CREATE SCHEDULE sauvegarde_nuit FOR BACKUP INTO 's3://…' RECURRING '@daily' FULL BACKUP '@weekly';
```

DB Console : `https://db1.corp.exemple.fr:8080` (état des nœuds, plages, requêtes lentes, statements). Mise à jour : remplacer le binaire et redémarrer **un nœud à la fois**.

Suite : [[02-yugabytedb|YugabyteDB]] · [[03-tidb|TiDB]] · [[04-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].

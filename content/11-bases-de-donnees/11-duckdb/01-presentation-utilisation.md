---
title: Présentation, installation et utilisation
description: DuckDB — base analytique embarquée en colonnes (MIT), « SQLite de l'analytique » : installation de la CLI (Linux, macOS, Windows), bibliothèques Python, R, Node.js, Java, requêtes SQL directes sur fichiers CSV, Parquet et JSON (y compris par motifs et sur S3), export, extensions (httpfs, postgres, mysql, sqlite, spatial, excel, iceberg, delta), ATTACH de bases PostgreSQL et SQLite, interface web locale (duckdb -ui), et usages pour l'administrateur (analyse de journaux, exports d'inventaire, rapports).
tags: [duckdb, analytique, sql, parquet, csv, olap, embarqué]
icon: info
---

**DuckDB** est une base **analytique** qui s'exécute dans le processus (comme [[06-sqlite/01-presentation-utilisation|SQLite]]) mais optimisée pour les agrégations sur de gros volumes : on interroge directement des fichiers CSV, Parquet ou JSON avec du SQL, sans rien importer. Pour un administrateur, c'est un outil redoutable pour analyser des **journaux**, des **exports** d'inventaire ou de facturation cloud.

## Installation

| Système | Commande |
| --- | --- |
| Linux, macOS | `curl https://install.duckdb.org \| sh` |
| Windows | `winget install DuckDB.cli` |
| macOS | `brew install duckdb` |
| Python / Node.js / R | `pip install duckdb` · `npm install @duckdb/node-api` · `install.packages("duckdb")` |

```bash
duckdb                              # base en mémoire
duckdb inventaire.duckdb            # fichier de base persistant
duckdb -c "SELECT version()"
```

## Interroger des fichiers

```sql
-- CSV, détection automatique des types
SELECT site, count(*) AS postes FROM 'export-glpi.csv' GROUP BY site ORDER BY postes DESC;
-- Plusieurs fichiers par motif
SELECT date_trunc('hour', ts) AS heure, count(*) FROM read_json_auto('journaux/*.json') GROUP BY 1 ORDER BY 1;
-- Journaux NGINX (format combiné) : découper avec une expression régulière
SELECT regexp_extract(line, '^(\S+)', 1) AS ip, count(*) AS n
FROM read_csv('access.log', columns = {'line': 'VARCHAR'}, delim = '\x01', header = false)
GROUP BY ip ORDER BY n DESC LIMIT 10;
-- Exporter en Parquet (compressé, typé)
COPY (SELECT * FROM 'export-glpi.csv') TO 'inventaire.parquet' (FORMAT parquet);
```

## Extensions et bases externes

```sql
INSTALL httpfs; LOAD httpfs;
CREATE SECRET minio (TYPE s3, KEY_ID 'acces', SECRET 'secret', ENDPOINT 'minio.corp.exemple.fr', URL_STYLE 'path');
SELECT count(*) FROM 's3://journaux/2026/11/*.parquet';

INSTALL postgres; LOAD postgres;
ATTACH 'host=srv-db-01 dbname=netbox user=lecture' AS nb (TYPE postgres, READ_ONLY);
SELECT name, status FROM nb.public.dcim_device LIMIT 10;

ATTACH 'outil.sqlite' AS s (TYPE sqlite);
```

Autres extensions : `spatial`, `excel`, `iceberg`, `delta`, `mysql`, `fts` (recherche plein texte).

## Interface web locale

```bash
duckdb -ui            # ouvre l'interface dans le navigateur (http://localhost:4213), données locales
```

<!-- CAPTURE: DuckDB UI — carnet SQL et résultat d'une requête sur un fichier Parquet | _assets/duckdb-ui.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

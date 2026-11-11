---
title: Project Nessie et lakeFS
description: Versionner un lac de données comme du code — Project Nessie (catalogue transactionnel pour Iceberg avec branches, étiquettes, validations et fusions multi-tables, serveur Quarkus, stockage JDBC ou RocksDB, API REST Iceberg, CLI, Spark SQL) et lakeFS (passerelle compatible S3 : dépôts, branches, commits, fusions, retour arrière, hooks, lakectl, déploiement Docker et Kubernetes) ; cas d'usage et différences.
tags: [nessie, lakefs, versionnage de données, iceberg, git pour les données, s3, lakehouse]
icon: layers
---

## Project Nessie

**Nessie** est un **catalogue** pour tables Iceberg qui fonctionne comme Git : **branches**, **étiquettes**, **validations** couvrant **plusieurs tables à la fois**, fusions. On peut ainsi préparer un chargement sur une branche, le contrôler, puis le publier d'un coup sur `main`.

```bash
docker run -d --name nessie -p 19120:19120 ghcr.io/projectnessie/nessie
# Production : stockage des versions dans PostgreSQL (JDBC), Cassandra, DynamoDB… ; chart Helm
```

- API Nessie : `http://serveur:19120/api/v2` ; API **catalogue REST Iceberg** : `http://serveur:19120/iceberg` (utilisable par tout moteur Iceberg).
- Authentification OpenID Connect et autorisations par branche à activer en production.

```sql
-- Spark SQL avec le catalogue Nessie « lac » et les extensions Nessie
CREATE BRANCH IF NOT EXISTS chargement_nov IN lac FROM main;
USE REFERENCE chargement_nov IN lac;
INSERT INTO lac.ventes.commandes SELECT * FROM staging.nouvelles;
-- contrôles qualité sur la branche…
MERGE BRANCH chargement_nov INTO main IN lac;
CREATE TAG fin_octobre IN lac FROM main;
SHOW LOG main IN lac;
```

L'interface web de Nessie (port 19120) affiche branches, validations et contenu des tables.

## lakeFS

**lakeFS** versionne **n'importe quels fichiers** d'un stockage objet (Parquet, CSV, images, modèles, tables Iceberg ou Delta). Il s'intercale comme une **passerelle compatible S3** : les outils lisent `s3://depot/branche/chemin` au lieu de `s3://bucket/chemin`. Les données ne sont pas copiées : une branche est une opération de métadonnées.

```bash
docker run -d --name lakefs -p 8000:8000 treeverse/lakefs:latest run --quickstart   # essai local
# Production : base PostgreSQL ou DynamoDB pour les métadonnées, stockage S3/MinIO/Azure/GCS
```

```yaml lakefs.yaml
database: { type: postgres, postgres: { connection_string: "postgres://lakefs:…@db/lakefs" } }
blockstore:
  type: s3
  s3: { region: eu-west-3, endpoint: "https://minio.exemple.fr", force_path_style: true }
auth: { encrypt: { secret_key: "<clé longue et aléatoire>" } }
listen_address: ":8000"
```

```bash
lakectl config                                   # point d'accès et clés
lakectl repo create lakefs://lac s3://bucket-lac
lakectl branch create lakefs://lac/essai --source lakefs://lac/main
aws s3 cp donnees.parquet s3://lac/essai/ventes/ --endpoint-url https://lakefs.exemple.fr
lakectl diff lakefs://lac/main lakefs://lac/essai
lakectl commit lakefs://lac/essai -m "Chargement de novembre"
lakectl merge lakefs://lac/essai lakefs://lac/main
lakectl branch revert lakefs://lac/main <commit>  # retour arrière
lakectl log lakefs://lac/main
```

Les **hooks** (actions déclenchées avant validation ou fusion) lancent des contrôles : schéma, qualité, absence de données personnelles.

## Nessie ou lakeFS ?

| Critère | Nessie | lakeFS |
| --- | --- | --- |
| Portée | Tables Iceberg (catalogue) | Tous les objets d'un stockage |
| Intégration | Moteurs Iceberg (Spark, Flink, Trino, Dremio) | Tout outil compatible S3 |
| Unité de version | Validations multi-tables | Validations de fichiers |
| Cas typique | Branches de chargement et isolement des tables | Expérimentations ML, reproductibilité, retour arrière de fichiers |

Voir aussi : [[01-iceberg-delta-hudi|Iceberg, Delta Lake et Hudi]] · versionnage des jeux de données ML avec DVC dans le chapitre science des données. Commandes : [[90-aide-memoire|aide-mémoire]].

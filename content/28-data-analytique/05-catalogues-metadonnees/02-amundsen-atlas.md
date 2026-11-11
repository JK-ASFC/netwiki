---
title: Amundsen et Apache Atlas
description: Amundsen (moteur de découverte de données issu de Lyft : services frontend, search, metadata, base Neo4j ou Atlas, Elasticsearch, bibliothèque databuilder, docker compose, port 5000, état du projet) et Apache Atlas (gouvernance pour l'écosystème Hadoop : types et entités, classifications propagées, lignage, crochets Hive, Kafka, HBase, Sqoop, intégration Ranger, HBase/Solr/Kafka, API REST, port 21000) ; comparatif des quatre catalogues.
tags: [amundsen, apache atlas, catalogue de données, gouvernance, hadoop, lignage, ranger]
icon: book-marked
---

## Amundsen

**Amundsen** (Apache 2.0, LF AI & Data) est un moteur de **découverte** de données : une recherche « à la Google » sur les tables, colonnes, tableaux de bord et utilisateurs, classée par popularité.

| Service | Rôle |
| --- | --- |
| Frontend (Flask + React) | Interface web, port **5000** |
| Search | Recherche (Elasticsearch) |
| Metadata | Métadonnées, sur **Neo4j** ou Apache Atlas |
| **databuilder** | Bibliothèque Python d'ingestion (extracteurs, chargeurs), lancée par Airflow ou cron |

```bash
git clone --recursive https://github.com/amundsen-io/amundsen.git && cd amundsen
docker compose -f docker-amundsen.yml up -d
python3 -m pip install amundsen-databuilder
python3 example/scripts/sample_data_loader.py   # données d'exemple
```

> [!NOTE]
> Le développement d'Amundsen a beaucoup ralenti ; pour un nouveau projet, OpenMetadata ou DataHub (voir [[01-openmetadata-datahub|OpenMetadata et DataHub]]) offrent davantage (qualité, glossaire, lignage fin).

## Apache Atlas

**Apache Atlas** est le service de **gouvernance** de l'écosystème **Hadoop** (Hive, HBase, Kafka, Sqoop, Storm), souvent associé à **Apache Ranger** pour les autorisations.

| Notion | Rôle |
| --- | --- |
| Types et entités | Modèle extensible : `hive_table`, `kafka_topic`, types personnalisés |
| **Classifications** | Étiquettes (`PII`, `CONFIDENTIEL`) **propagées** le long du lignage |
| Lignage | Construit automatiquement par les **crochets** (*hooks*) Hive, Spark, Sqoop… |
| Glossaire | Termes métier reliés aux entités |
| Ranger | Politiques d'accès **par classification** (*tag-based policies*) : masquer toute colonne `PII` |

Atlas s'appuie sur **HBase** (graphe JanusGraph), **Solr** (index) et **Kafka** (notifications des crochets). Interface et API REST sur le port **21000**.

```bash
bin/atlas_start.py ; bin/atlas_stop.py
curl -u admin:… http://atlas:21000/api/atlas/admin/version
curl -u admin:… "http://atlas:21000/api/atlas/v2/search/basic?typeName=hive_table&query=commandes" | jq '.entities[].displayText'
curl -u admin:… "http://atlas:21000/api/atlas/v2/lineage/<guid>?direction=BOTH&depth=3" | jq
```

> [!WARNING]
> Le compte par défaut `admin`/`admin` (authentification par fichier) doit être remplacé par LDAP, Kerberos ou un mot de passe fort avant toute mise en service.

## Comparatif

| Critère | OpenMetadata | DataHub | Amundsen | Atlas |
| --- | --- | --- | --- | --- |
| Public | Toute organisation | Grandes organisations | Découverte simple | Écosystème Hadoop |
| Architecture | Serveur + base + recherche | Orientée flux (Kafka) | Microservices + Neo4j | HBase, Solr, Kafka |
| Lignage colonnes | Oui | Oui | Limité | Selon crochets |
| Qualité des données | Intégrée | Assertions, intégrations | Non | Non |
| Activité du projet | Forte | Forte | Faible | Modérée |

Commandes : [[90-aide-memoire|aide-mémoire]].

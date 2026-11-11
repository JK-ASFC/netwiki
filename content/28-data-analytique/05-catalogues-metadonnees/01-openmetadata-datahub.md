---
title: OpenMetadata et DataHub
description: Rôle d'un catalogue de données (découverte, lignage, propriétaires, glossaire, classification, qualité) puis OpenMetadata (serveur Java, MySQL ou PostgreSQL, Elasticsearch ou OpenSearch, ingestion via Airflow ou en ligne de commande metadata ingest, connecteurs, tests de qualité, port 8585) et DataHub (GMS, frontend 9002, Kafka, recettes d'ingestion YAML, datahub docker quickstart, lignage au niveau des colonnes, actions) ; sécurité et choix.
tags: [openmetadata, datahub, catalogue de données, gouvernance, lignage, métadonnées, data discovery]
icon: book-marked
---

## À quoi sert un catalogue de données ?

Quand une organisation a des centaines de tables, tableaux de bord et flux, il devient difficile de savoir **quelles données existent**, **qui en est responsable**, **d'où elles viennent** et **si l'on peut s'y fier**. Un catalogue collecte automatiquement ces **métadonnées** :

| Fonction | Exemple |
| --- | --- |
| Découverte | Recherche « chiffre d'affaires » → tables, colonnes, tableaux de bord |
| **Lignage** | Cette table vient de tel flux Airbyte, transformée par tel modèle dbt, affichée dans tel tableau Superset |
| Propriétaires et domaines | Équipe responsable, contact |
| **Glossaire** | Définition partagée de « client actif » |
| Classification | Étiquettes `PII`, `Confidentiel`, propagées au lignage (RGPD) |
| Qualité | Résultats de tests (nullité, unicité, fraîcheur) |

## OpenMetadata

**OpenMetadata** (Apache 2.0) regroupe catalogue, lignage, qualité, glossaire et collaboration (conversations, tâches) dans une seule interface.

| Composant | Rôle |
| --- | --- |
| Serveur OpenMetadata | API et interface web (**8585**) |
| Base | MySQL ou PostgreSQL |
| Recherche | Elasticsearch ou OpenSearch |
| Ingestion | Cadres d'ingestion Python, orchestrés par **Airflow** intégré ou en ligne de commande |

```bash
# Essai avec Docker Compose (fichier publié avec chaque version du projet)
curl -sL -o docker-compose.yml https://github.com/open-metadata/OpenMetadata/releases/download/<version>/docker-compose.yml
docker compose -f docker-compose.yml up -d
# Interface : http://localhost:8585 ; Airflow d'ingestion : http://localhost:8080
```

L'ingestion se configure dans l'interface (services de bases, tableaux de bord, pipelines, ML) ou en **YAML** :

```yaml postgres-ingestion.yaml
source:
  type: postgres
  serviceName: pg_boutique
  serviceConnection:
    config: { type: Postgres, hostPort: "pg1:5432", username: catalogue, authType: { password: "…" }, database: boutique }
  sourceConfig: { config: { type: DatabaseMetadata, includeViews: true } }
sink: { type: metadata-rest, config: {} }
workflowConfig:
  openMetadataServerConfig:
    hostPort: "http://openmetadata:8585/api"
    authProvider: openmetadata
    securityConfig: { jwtToken: "<jeton du robot d'ingestion>" }
```

```bash
python3 -m pip install "openmetadata-ingestion[postgres]"
metadata ingest -c postgres-ingestion.yaml
metadata profile -c postgres-profiler.yaml        # statistiques de colonnes
metadata test -c tests-qualite.yaml               # tests de qualité
```

## DataHub

**DataHub** (Apache 2.0, issu de LinkedIn) repose sur une architecture orientée flux : les changements de métadonnées circulent dans **Kafka**, ce qui le destine aux grandes organisations.

| Composant | Rôle |
| --- | --- |
| **GMS** | Service de métadonnées (API REST et GraphQL, port 8080) |
| Frontend | Interface web (**9002**) |
| Stockage | MySQL ou PostgreSQL, Elasticsearch ou OpenSearch, Kafka |

```bash
python3 -m pip install --upgrade acryl-datahub
datahub docker quickstart                        # pile complète en Docker (essai)
datahub docker check
datahub ingest -c recette-postgres.yml
datahub get --urn "urn:li:dataset:(urn:li:dataPlatform:postgres,boutique.public.commandes,PROD)"
datahub docker nuke                              # supprime la pile d'essai
# Production : charts Helm « datahub » et « datahub-prerequisites »
```

```yaml recette-postgres.yml
source:
  type: postgres
  config:
    host_port: pg1:5432
    database: boutique
    username: catalogue
    password: "${PG_MDP}"
    profiling: { enabled: true }
sink:
  type: datahub-rest
  config: { server: "http://datahub-gms:8080", token: "${DATAHUB_JETON}" }
```

Points forts : **lignage au niveau des colonnes** (dbt, Spark, SQL analysé), **Actions** (réagir aux changements : notifier, propager une étiquette), API GraphQL complète.

## Sécurité

- Brancher l'authentification sur l'annuaire (OIDC, LDAP) et désactiver les comptes par défaut (DataHub : `datahub`/`datahub` à changer immédiatement).
- Comptes d'ingestion en **lecture seule** sur les métadonnées ; le profilage lit des données réelles, à limiter sur les tables sensibles.
- Jetons d'API à durée limitée, conservés dans un gestionnaire de secrets.

Voir aussi : [[02-amundsen-atlas|Amundsen et Apache Atlas]]. Commandes : [[90-aide-memoire|aide-mémoire]].

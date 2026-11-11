---
title: Catalogues de données — aide-mémoire
description: Ports et commandes d'OpenMetadata (metadata ingest, profile, test), DataHub (datahub docker quickstart, ingest, get), Amundsen (docker compose, databuilder) et Apache Atlas (atlas_start, API REST de recherche et de lignage).
tags: [aide-mémoire, openmetadata, datahub, amundsen, apache atlas, catalogue de données]
icon: terminal
---

Explications : [[01-openmetadata-datahub|OpenMetadata et DataHub]] · [[02-amundsen-atlas|Amundsen et Apache Atlas]].

| Outil | Ports |
| --- | --- |
| OpenMetadata | 8585 interface et API, 8080 Airflow d'ingestion |
| DataHub | 9002 interface, 8080 GMS (API) |
| Amundsen | 5000 interface, 5001 search, 5002 metadata, 7474/7687 Neo4j |
| Apache Atlas | 21000 interface et API |

```bash
# OpenMetadata
metadata ingest -c ingestion.yaml ; metadata profile -c profiler.yaml ; metadata test -c tests.yaml

# DataHub
datahub docker quickstart ; datahub docker check
datahub ingest -c recette.yml ; datahub get --urn "<urn>"

# Amundsen
docker compose -f docker-amundsen.yml up -d

# Apache Atlas
bin/atlas_start.py ; bin/atlas_stop.py
curl -u admin:… "http://atlas:21000/api/atlas/v2/search/basic?typeName=hive_table&query=nom"
curl -u admin:… "http://atlas:21000/api/atlas/v2/lineage/<guid>?direction=BOTH&depth=3"
```

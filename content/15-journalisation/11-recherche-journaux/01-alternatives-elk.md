---
title: Alternatives libres à la pile ELK
description: Piles de recherche et d'analyse de journaux après le changement de licence d'Elasticsearch (2021) : état actuel (Elasticsearch de nouveau sous AGPL depuis 2024 en plus de SSPL et Elastic License), OpenSearch (Apache 2.0, Linux Foundation) avec OpenSearch Dashboards et Data Prepper, Graylog (sur OpenSearch), pile « EFK/OFK » (Fluent Bit ou Vector vers OpenSearch), Loki, Quickwit et VictoriaLogs : comparaison (coût, licence, recherche plein texte, rétention), critères de choix et migration depuis Elasticsearch.
tags: [elk, opensearch, elasticsearch, graylog, journaux, licence, efk]
icon: info
---

La pile **ELK** (Elasticsearch, Logstash, Kibana) a longtemps été la référence. En 2021, Elastic a quitté la licence Apache 2.0 (SSPL et Elastic License) ; Amazon a alors créé **OpenSearch** (fork Apache 2.0, aujourd'hui sous la Linux Foundation). En 2024, Elastic a ajouté l'**AGPL** comme option de licence d'Elasticsearch et Kibana : Elasticsearch est de nouveau « open source » au sens OSI, sous une licence copyleft forte.

| Solution | Licence | Recherche plein texte | Coût de stockage | Remarques |
| --- | --- | --- | --- | --- |
| **Elasticsearch + Kibana** | AGPL / SSPL / Elastic License | Excellente | Élevé (index complets) | Fonctions avancées sous licence payante |
| **OpenSearch + Dashboards** | Apache 2.0 | Excellente | Élevé | Sécurité, alertes, détection d'anomalies inclus ([[02-opensearch/01-presentation-installation\|OpenSearch]]) |
| **[[04-graylog/01-presentation-installation\|Graylog]]** | SSPL (Open) / commercial | Bonne (sur OpenSearch) | Élevé | Interface orientée exploitation, flux, alertes |
| [[09-loki-promtail/01-loki\|Loki]] | AGPL | Filtrage, pas d'index plein texte | **Faible** | Intégration Grafana |
| [[02-quickwit-victorialogs\|Quickwit]] | Apache 2.0 | Très bonne (index sur stockage objet) | Faible | API compatible Elasticsearch partielle |
| [[02-quickwit-victorialogs\|VictoriaLogs]] | Apache 2.0 | Bonne (LogsQL) | Faible | Très économe en ressources |

## Pile recommandée « tout libre » classique

```text
Agents (Fluent Bit, Vector, Winlogbeat/NXLog) → Data Prepper ou Logstash (OSS) → OpenSearch (3 nœuds) → OpenSearch Dashboards
```

Collecte : [[03-fluent-bit/01-presentation-installation|Fluent Bit]], [[10-fluentd-vector/02-vector|Vector]] ou [[02-logstash/01-presentation-installation|Logstash]] (la sortie `opensearch` est un greffon).

## Migrer depuis Elasticsearch

1. Vérifier la compatibilité de version (OpenSearch 1.x/2.x ≈ Elasticsearch 7.10) et les fonctions utilisées (X-Pack, ingest pipelines, ILM → ISM).
2. Recréer les modèles d'index et politiques de rétention (**ISM** dans OpenSearch).
3. Copier les données récentes (*reindex from remote*, instantanés compatibles, ou double écriture temporaire par les agents) ; laisser expirer l'ancien cluster.

Suite : [[02-quickwit-victorialogs|Quickwit et VictoriaLogs]] · [[90-aide-memoire|aide-mémoire]].

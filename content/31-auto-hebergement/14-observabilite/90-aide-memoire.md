---
title: Kibana et OpenObserve — aide-mémoire
description: Déploiement et ports de Kibana (vers Elasticsearch) et d'OpenObserve, et positionnement face à OpenSearch Dashboards et Grafana.
tags: [aide-mémoire, kibana, openobserve, opensearch dashboards, observabilité]
icon: terminal
---

Explications : [[01-kibana-openobserve|Kibana et OpenObserve]].

| Outil | Port |
| --- | --- |
| Kibana | 5601 |
| OpenSearch Dashboards | 5601 |
| OpenObserve | 5080 |

```bash
# Kibana
docker run -d -p 5601:5601 -e ELASTICSEARCH_HOSTS=https://elasticsearch:9200 \
  -e ELASTICSEARCH_USERNAME=kibana_system -e ELASTICSEARCH_PASSWORD='…' docker.elastic.co/kibana/kibana:8.x.x

# OpenObserve
docker run -d -p 5080:5080 -e ZO_ROOT_USER_EMAIL=admin@exemple.fr -e ZO_ROOT_USER_PASSWORD='…' \
  -v /srv/openobserve:/data openobserve/openobserve:latest
# Ingestion : API type Elasticsearch, OpenTelemetry, Fluent Bit, Vector, syslog
```

> Libre strict : OpenSearch + OpenSearch Dashboards. Léger tout-en-un : OpenObserve. Multi-sources : Grafana.

---
title: Kibana et OpenObserve
description: Explorer journaux, métriques et traces — Kibana (visualisation et exploration pour Elasticsearch/OpenSearch : Discover, Lens, tableaux de bord, alertes ; question de la licence Elastic et du pendant OpenSearch Dashboards) et OpenObserve (observabilité tout-en-un en Rust, logs/métriques/traces, stockage objet économe, langage SQL, faible empreinte, ingestion compatible, port 5080) ; positionnement face à Grafana et à la pile ELK, et choix.
tags: [kibana, opensearch dashboards, openobserve, observabilité, logs, métriques, traces, elasticsearch]
icon: telescope
---

Ces outils servent à **explorer et visualiser** des journaux, des métriques et des traces. Ils recoupent la supervision déjà traitée dans le wiki (Elasticsearch, OpenSearch, Grafana, Prometheus) : cette page situe Kibana et présente OpenObserve, une alternative légère.

## Kibana

**Kibana** est l'interface de visualisation d'**[[12-recherche-messages/01-elasticsearch/01-presentation-installation|Elasticsearch]]** : exploration des documents (**Discover**), création de visualisations (**Lens**), **tableaux de bord**, cartes, détection d'anomalies et **alertes**. C'est la « vitrine » de la pile **ELK/Elastic** (Elasticsearch + Logstash/Beats + Kibana).

```bash
docker run -d --name kibana -p 127.0.0.1:5601:5601 \
  -e ELASTICSEARCH_HOSTS=https://elasticsearch:9200 \
  -e ELASTICSEARCH_USERNAME=kibana_system -e ELASTICSEARCH_PASSWORD='…' \
  docker.elastic.co/kibana/kibana:8.x.x
```

> [!NOTE]
> **Licence** : Kibana suit Elastic. Les versions récentes sont de nouveau proposées sous **AGPL** (en plus des licences Elastic), mais des périodes antérieures étaient sous licence **non libre** (SSPL/Elastic License). Son équivalent entièrement libre est **OpenSearch Dashboards** (fork Apache 2.0), à utiliser avec [[12-recherche-messages/02-opensearch/01-presentation-installation|OpenSearch]]. Vérifier la licence de la version visée et, pour un besoin 100 % libre, préférer OpenSearch Dashboards.

## OpenObserve

**OpenObserve** est une plate-forme d'**observabilité tout-en-un** écrite en Rust : **journaux, métriques et traces** dans un seul outil, avec un **stockage objet** (disque local ou S3/MinIO) très **économe** (jusqu'à bien moins d'espace qu'Elasticsearch pour les mêmes logs), une interface de recherche en **SQL**, des tableaux de bord et des alertes. Un seul binaire, faible empreinte.

```bash
docker run -d --name openobserve -p 127.0.0.1:5080:5080 \
  -e ZO_ROOT_USER_EMAIL=admin@exemple.fr -e ZO_ROOT_USER_PASSWORD='…' \
  -v /srv/openobserve:/data openobserve/openobserve:latest
# Interface : http://serveur:5080
```

- **Ingestion** compatible avec des formats répandus (API façon Elasticsearch, OpenTelemetry, Fluent Bit, Vector, syslog) : on peut souvent rediriger une collecte existante.
- Idéal pour **centraliser les journaux** à moindre coût quand la pile ELK est trop lourde ou trop gourmande.
- Projet jeune et actif : vérifier la maturité des fonctions avancées avant un usage critique.

## Positionnement

| Outil | Rôle |
| --- | --- |
| **Kibana** | Interface d'Elasticsearch (ELK) : logs, recherche, dashboards |
| **OpenSearch Dashboards** | Équivalent libre, pour OpenSearch |
| **Grafana** | Tableaux de bord multi-sources (Prometheus, Loki, bases, Elasticsearch…) |
| **OpenObserve** | Observabilité légère tout-en-un (logs/métriques/traces) |
| **Loki + Grafana** | Journaux économes dans l'écosystème Grafana |

## Choisir

| Besoin | Outil |
| --- | --- |
| Déjà sur Elasticsearch/ELK | Kibana (ou OpenSearch Dashboards pour le libre) |
| Centraliser les logs à faible coût, tout-en-un | OpenObserve |
| Tableaux de bord métriques et multi-sources | [[06-supervision/03-grafana/01-presentation-installation\|Grafana]] |
| Journaux légers avec Grafana | Grafana Loki |

Dans tous les cas : **compte en lecture seule** côté données, accès à l'interface protégé (auth, SSO, réseau d'administration), HTTPS, et rétention des journaux définie (volume et obligations légales).

Commandes : [[90-aide-memoire|aide-mémoire]].

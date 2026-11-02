---
title: Vector
description: Vector (Datadog, MPL 2.0) — pipeline d'observabilité haute performance en Rust pour journaux et métriques : rôles agent et agrégateur, installation (script, paquets Debian/RHEL, Windows MSI, Homebrew, Docker, Helm), configuration YAML/TOML (sources file, journald, syslog, kubernetes_logs, socket, http_server, prometheus_scrape ; transforms remap en VRL, filter, route, dedupe, sample, aggregate ; sinks loki, elasticsearch, clickhouse, s3, kafka, prometheus_exporter), langage VRL, tampons disque, tests unitaires, vector top et tap pour le dépannage.
tags: [vector, vrl, journaux, pipeline, rust, observabilité]
icon: info
---

**Vector** collecte, transforme et route journaux et métriques avec de très bonnes performances et un langage de transformation sûr, **VRL** (*Vector Remap Language*). Il remplace avantageusement Logstash ou Fluentd dans de nombreux cas, et sait écrire dans [[01-loki|Loki]], Elasticsearch/OpenSearch, [[24-clickhouse/01-presentation-installation|ClickHouse]], S3 ou Kafka.

## Installation

| Système | Commande |
| --- | --- |
| Linux | `curl --proto '=https' --tlsv1.2 -sSfL https://sh.vector.dev \| bash` ou dépôt APT/RPM du projet (script setup.vector.dev) |
| Windows | MSI des versions |
| macOS | `brew install vectordotdev/brew/vector` |
| Docker / Kubernetes | `timberio/vector` ; chart Helm `vector/vector` (rôles Agent ou Aggregator) |

## Configuration

```yaml
# /etc/vector/vector.yaml
sources:
  nginx:
    type: file
    include: [/var/log/nginx/access.log]
  journal:
    type: journald
transforms:
  nginx_parse:
    type: remap
    inputs: [nginx]
    source: |
      . = parse_nginx_log!(.message, "combined")
      .environnement = "prod"
      del(.agent)
  erreurs:
    type: filter
    inputs: [nginx_parse]
    condition: .status >= 500
sinks:
  loki:
    type: loki
    inputs: [nginx_parse, journal]
    endpoint: http://loki.corp.exemple.fr:3100
    labels: { job: "{{ source_type }}", host: "{{ host }}" }
    encoding: { codec: json }
    buffer: { type: disk, max_size: 1073741824 }
  alertes_erreurs:
    type: http
    inputs: [erreurs]
    uri: https://alertes.corp.exemple.fr/webhook
    encoding: { codec: json }
```

```bash
vector validate /etc/vector/vector.yaml && sudo systemctl restart vector
vector top                         # débit par composant
vector tap nginx_parse             # voir les événements à la sortie d'une transformation
vector vrl                         # console interactive pour mettre au point un programme VRL
```

Commandes : [[90-aide-memoire|aide-mémoire]].

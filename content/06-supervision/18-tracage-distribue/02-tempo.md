---
title: Grafana Tempo
description: Grafana Tempo (AGPL) — backend de traces distribué à grande échelle qui stocke les traces dans un stockage objet sans index coûteux : architecture (distributor, ingester, querier, compactor, metrics-generator), modes monolithique et microservices, installation (binaire, Docker, Helm tempo et tempo-distributed), réception OTLP, Jaeger et Zipkin, TraceQL, génération de métriques RED et graphe de services, liens traces-journaux-métriques dans Grafana (exemplars, Loki), rétention et dimensionnement.
tags: [tempo, grafana, traces, traceql, stockage objet, opentelemetry]
icon: info
---

**Tempo** stocke des **milliards de spans** à faible coût dans S3/MinIO, sans indexer chaque attribut : on retrouve une trace par son identifiant (depuis un journal ou un *exemplar* de métrique) ou par une requête **TraceQL**. Il s'intègre nativement à [[03-grafana/01-presentation-installation|Grafana]] avec Loki et Prometheus/Mimir.

## Installation (monolithique)

```yaml
# tempo.yaml
server: { http_listen_port: 3200 }
distributor:
  receivers:
    otlp: { protocols: { grpc: { endpoint: 0.0.0.0:4317 }, http: { endpoint: 0.0.0.0:4318 } } }
    jaeger: { protocols: { thrift_http: {} } }
    zipkin: {}
storage:
  trace:
    backend: s3
    s3: { bucket: tempo, endpoint: minio.corp.exemple.fr, access_key: TEMPO, secret_key: SecretTempo2026 }
compactor: { compaction: { block_retention: 336h } }       # 14 jours
metrics_generator:
  storage: { path: /var/tempo/generator/wal, remote_write: [{ url: http://mimir.corp.exemple.fr/api/v1/push }] }
overrides: { defaults: { metrics_generator: { processors: [service-graphs, span-metrics] } } }
```

```bash
docker run -d --name tempo -p 3200:3200 -p 4317:4317 -p 4318:4318 -v $PWD/tempo.yaml:/etc/tempo.yaml grafana/tempo:latest -config.file=/etc/tempo.yaml
# Kubernetes : helm install tempo grafana/tempo-distributed -n tempo -f valeurs.yaml
```

## TraceQL (dans Grafana → Explore → Tempo)

```text
{ resource.service.name = "inventaire" && status = error }
{ span.http.route = "/api/equipements" && duration > 2s }
{ resource.service.name = "frontal" } >> { resource.service.name = "base" && duration > 500ms }
```

Le **metrics-generator** produit des métriques RED (taux, erreurs, durées) et un **graphe des services** à partir des traces.

Suite : [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].

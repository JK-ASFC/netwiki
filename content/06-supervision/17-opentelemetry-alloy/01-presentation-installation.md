---
title: Présentation, installation et configuration
description: OpenTelemetry Collector (CNCF) et Grafana Alloy — collecteurs unifiés de métriques, journaux et traces : OpenTelemetry (standard, SDK, protocole OTLP, distributions core et contrib du Collector, récepteurs, processeurs, exportateurs, pipelines, extensions, déploiement agent ou passerelle, installation Linux paquets, Windows MSI, Docker, Kubernetes avec l'opérateur), Grafana Alloy (successeur de Grafana Agent et Promtail, syntaxe Alloy, composants prometheus.scrape, loki.source, otelcol, interface de débogage, conversion des anciennes configurations) et exemples vers Prometheus, Loki, Tempo et autres.
tags: [opentelemetry, otel, collector, otlp, grafana alloy, télémétrie, traces]
icon: info
---

**OpenTelemetry** (OTel) est le standard ouvert d'instrumentation : les applications produisent métriques, journaux et **traces** au format **OTLP**, et un **Collector** les reçoit, les transforme et les envoie vers les outils de votre choix, sans dépendre d'un fournisseur. **Grafana Alloy** est la distribution du Collector de Grafana Labs, qui remplace Grafana Agent et Promtail.

| Brique du Collector | Exemples |
| --- | --- |
| **Receivers** | `otlp` (4317 gRPC, 4318 HTTP), `prometheus`, `hostmetrics`, `filelog`, `syslog`, `kafka` |
| **Processors** | `batch`, `memory_limiter`, `resource`, `attributes`, `filter`, `k8sattributes`, `tail_sampling` |
| **Exporters** | `otlp`/`otlphttp` (Tempo, Jaeger, SigNoz), `prometheusremotewrite`, `loki`/`otlphttp` vers Loki, `debug` |

## OpenTelemetry Collector

```bash
# Debian/Ubuntu : paquet .deb des versions GitHub (distribution contrib, la plus complète)
sudo apt install ./otelcol-contrib_*_linux_amd64.deb      # service otelcol-contrib, configuration /etc/otelcol-contrib/config.yaml
```

Windows : MSI ; Docker : `otel/opentelemetry-collector-contrib` ; Kubernetes : **OpenTelemetry Operator** (ressource `OpenTelemetryCollector` et injection automatique de l'instrumentation).

```yaml
receivers:
  otlp:
    protocols: { grpc: { endpoint: 0.0.0.0:4317 }, http: { endpoint: 0.0.0.0:4318 } }
  hostmetrics:
    collection_interval: 30s
    scrapers: { cpu: {}, memory: {}, filesystem: {}, network: {} }
processors:
  memory_limiter: { check_interval: 1s, limit_percentage: 80 }
  batch: {}
  resource:
    attributes: [{ key: deployment.environment, value: prod, action: upsert }]
exporters:
  otlp/tempo: { endpoint: tempo.corp.exemple.fr:4317, tls: { insecure: true } }
  prometheusremotewrite: { endpoint: http://vm.corp.exemple.fr:8428/api/v1/write }
  otlphttp/loki: { endpoint: http://loki.corp.exemple.fr:3100/otlp }
service:
  pipelines:
    traces: { receivers: [otlp], processors: [memory_limiter, batch], exporters: [otlp/tempo] }
    metrics: { receivers: [otlp, hostmetrics], processors: [memory_limiter, resource, batch], exporters: [prometheusremotewrite] }
    logs: { receivers: [otlp], processors: [memory_limiter, batch], exporters: [otlphttp/loki] }
```

```bash
otelcol-contrib validate --config /etc/otelcol-contrib/config.yaml && sudo systemctl restart otelcol-contrib
```

## Grafana Alloy

```bash
# Dépôt apt.grafana.com puis
sudo apt install alloy            # Windows : installeur ; macOS : brew install grafana/grafana/alloy ; Docker : grafana/alloy
```

```text
// /etc/alloy/config.alloy
prometheus.exporter.unix "noeud" { }
prometheus.scrape "noeud" {
  targets    = prometheus.exporter.unix.noeud.targets
  forward_to = [prometheus.remote_write.mimir.receiver]
}
prometheus.remote_write "mimir" {
  endpoint { url = "http://mimir.corp.exemple.fr/api/v1/push" }
}
local.file_match "journaux" { path_targets = [{"__path__" = "/var/log/*.log", "job" = "syslog"}] }
loki.source.file "journaux" {
  targets    = local.file_match.journaux.targets
  forward_to = [loki.write.central.receiver]
}
loki.write "central" {
  endpoint { url = "http://loki.corp.exemple.fr:3100/loki/api/v1/push" }
}
```

Interface de débogage : `http://localhost:12345` (graphe des composants et leurs données). Conversion : `alloy convert --source-format=promtail promtail.yaml -o config.alloy` (aussi `prometheus`, `static`, `otelcol`).

<!-- CAPTURE: Grafana Alloy — interface de débogage, graphe des composants | _assets/alloy-ui.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

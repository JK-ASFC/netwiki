---
title: Présentation, installation et configuration
description: OpenTelemetry Collector (CNCF) et Grafana Alloy — collecteurs unifiés de métriques, journaux et traces : OpenTelemetry (standard, SDK, protocole OTLP, distributions core et contrib du Collector, récepteurs, processeurs, exportateurs, pipelines, extensions, déploiement agent ou passerelle, installation Linux paquets, Windows MSI, Docker, Kubernetes avec l'opérateur), Grafana Alloy (successeur de Grafana Agent et Promtail, syntaxe Alloy, composants prometheus.scrape, loki.source, otelcol, interface de débogage, conversion des anciennes configurations) et exemples vers Prometheus, Loki, Tempo et autres.
tags: [opentelemetry, otel, collector, otlp, grafana alloy, télémétrie, traces]
icon: info
---

**OpenTelemetry** (OTel) est le standard ouvert d'instrumentation : les applications produisent métriques, journaux et **traces** au format **OTLP**, et un **Collector** les reçoit, les transforme et les envoie vers les outils de votre choix, sans dépendre d'un fournisseur. **Grafana Alloy** est la distribution du Collector de Grafana Labs, qui remplace Grafana Agent et Promtail.

Les trois **signaux** (traces, métriques, journaux) partagent une même description de la source (*resource* : `service.name`, `deployment.environment`, hôte…) définie par les **conventions sémantiques** OTel, ce qui permet de passer d'une trace lente au journal correspondant.

| Brique du Collector | Exemples |
| --- | --- |
| **Receivers** | `otlp` (4317 gRPC, 4318 HTTP), `prometheus`, `hostmetrics`, `filelog`, `journald`, `syslog`, `kafka`, `jaeger`, `zipkin`, `statsd`, `fluentforward`, `k8s_cluster`, `kubeletstats` |
| **Processors** | `batch`, `memory_limiter`, `resource`, `resourcedetection`, `attributes`, `filter`, `transform` (OTTL), `k8sattributes`, `tail_sampling`, `probabilistic_sampler`, `redaction` |
| **Exporters** | `otlp`/`otlphttp` (Tempo, Jaeger, SigNoz), `prometheusremotewrite`, `prometheus` (expose en `/metrics`), `loki`/`otlphttp` vers Loki, `kafka`, `file`, `debug` |
| **Connectors** | `spanmetrics` (métriques RED à partir des traces), `servicegraph`, `count`, `routing` |
| **Extensions** | `health_check`, `pprof`, `zpages`, `basicauth`, `oauth2client`, `file_storage` (file d'attente persistante) |

### Agent ou passerelle

- **Agent** : un Collector par hôte/nœud (collecte locale `hostmetrics`/`filelog`, enrichissement, relais). Faible latence, résilient.
- **Passerelle** (*gateway*) : un (ou plusieurs) Collector central recevant l'OTLP des agents et des applications — c'est là que se font l'échantillonnage par traces complètes (`tail_sampling`), la limitation de débit et le routage par destination. Les deux se combinent (agents → passerelle → bases).

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

### Échantillonnage des traces (passerelle)

Sur une passerelle, `tail_sampling` décide de garder ou non une trace **une fois complète** (par ex. toujours les erreurs et les traces lentes, 10 % du reste) :

```yaml
processors:
  tail_sampling:
    decision_wait: 10s
    policies:
      - name: erreurs
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: lentes
        type: latency
        latency: { threshold_ms: 1000 }
      - name: echantillon
        type: probabilistic
        probabilistic: { sampling_percentage: 10 }
```

Le connecteur `spanmetrics` dérive en plus des métriques de débit, d'erreurs et de latence (RED) par service directement des traces.

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

Alloy décrit un **graphe de composants** reliés par leurs références (`forward_to`, `.targets`). Familles de composants :

| Préfixe | Rôle | Exemples |
| --- | --- | --- |
| `prometheus.*` | Métriques | `prometheus.scrape`, `prometheus.exporter.unix`, `prometheus.exporter.windows`, `prometheus.relabel`, `prometheus.remote_write` |
| `loki.*` | Journaux | `loki.source.file`, `loki.source.journal`, `loki.source.syslog`, `loki.process` (étapes), `loki.write` |
| `otelcol.*` | OTLP (traces/métriques/logs) | `otelcol.receiver.otlp`, `otelcol.processor.batch`, `otelcol.processor.tail_sampling`, `otelcol.exporter.otlp` |
| `discovery.*` | Découverte de cibles | `discovery.kubernetes`, `discovery.docker`, `discovery.file`, `discovery.relabel` |
| `pyroscope.*` | Profilage continu | `pyroscope.scrape`, `pyroscope.write` |
| Utilitaires | Divers | `local.file_match`, `remote.http`, `declare` (composants personnalisés), `livedebugging` |

Interface de débogage : `http://localhost:12345` (graphe des composants et leurs données, *live debugging*). Conversion : `alloy convert --source-format=promtail promtail.yaml -o config.alloy` (aussi `prometheus`, `static`, `otelcol`). Validation : `alloy fmt config.alloy` et `alloy run --dry-run`.

<!-- CAPTURE: Grafana Alloy — interface de débogage, graphe des composants | _assets/alloy-ui.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

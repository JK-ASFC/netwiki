---
title: Grafana Loki
description: Grafana Loki (AGPL) — agrégation de journaux « à la Prometheus » : indexation des seules étiquettes, contenu compressé en blocs sur stockage objet, modes de déploiement (monolithique, simple scalable, microservices), installation (binaire, paquets, Docker, Helm loki), configuration (schema_config TSDB, storage S3/MinIO, limits, retention par le compactor), envoi des journaux (Alloy, OpenTelemetry, Fluent Bit, Vector, API push), LogQL (sélecteurs, filtres, parsers json/logfmt/pattern, métriques sur journaux), règles d'alerte (ruler), multi-locataires, cardinalité des étiquettes et bonnes pratiques.
tags: [loki, grafana, logql, journaux, stockage objet, observabilité]
icon: info
---

**Loki** stocke les journaux à moindre coût : il n'indexe que quelques **étiquettes** (`job`, `host`, `namespace`, `app`) et conserve le texte compressé dans un **stockage objet** ([[07-minio/01-presentation-installation|MinIO]], S3). Les recherches se font en **LogQL** dans [[03-grafana/01-presentation-installation|Grafana]], à côté des métriques et des traces.

## Installation (monolithique)

```bash
# Dépôt apt.grafana.com puis
sudo apt install loki            # binaire et service ; RHEL : rpm.grafana.com ; Docker : grafana/loki ; Kubernetes : helm install loki grafana/loki
```

```yaml
# /etc/loki/config.yml (extraits)
auth_enabled: false
server: { http_listen_port: 3100 }
common:
  path_prefix: /var/lib/loki
  replication_factor: 1
  ring: { kvstore: { store: inmemory } }
  storage:
    s3: { endpoint: minio.corp.exemple.fr, bucketnames: loki, access_key_id: LOKI, secret_access_key: SecretLoki2026, s3forcepathstyle: true }
schema_config:
  configs:
    - { from: "2026-01-01", store: tsdb, object_store: s3, schema: v13, index: { prefix: index_, period: 24h } }
limits_config:
  retention_period: 744h            # 31 jours
  ingestion_rate_mb: 16
compactor:
  working_directory: /var/lib/loki/compactor
  retention_enabled: true
  delete_request_store: s3
```

## Envoyer des journaux

- **Grafana Alloy** (recommandé, voir [[17-opentelemetry-alloy/01-presentation-installation|OpenTelemetry et Alloy]]), [[03-fluent-bit/01-presentation-installation|Fluent Bit]], [[10-fluentd-vector/02-vector|Vector]], ou OTLP (`/otlp`).
- Test : `curl -H 'Content-Type: application/json' -X POST http://loki:3100/loki/api/v1/push -d '{"streams":[{"stream":{"job":"test"},"values":[["'$(date +%s%N)'","bonjour Loki"]]}]}'`.

## LogQL

```text
{job="nginx", host="srv-web-01"} |= "error"
{job="nginx"} | json | status >= 500 | line_format "{{.remote_addr}} {{.request}}"
{app="inventaire"} | logfmt | level="error"
sum by (host) (count_over_time({job="sshd"} |= "Failed password" [5m]))          # métrique sur journaux
topk(10, sum by (remote_addr) (rate({job="nginx"} | json [1h])))
```

> [!WARNING]
> Ne transformez pas en **étiquettes** des valeurs à forte cardinalité (adresse IP, identifiant de requête, utilisateur) : Loki crée un flux par combinaison d'étiquettes et s'effondre. Filtrez-les au moment de la requête (`| json | ip="…"`).

Suite : [[02-promtail-migration|Promtail et migration]] · [[90-aide-memoire|aide-mémoire]].

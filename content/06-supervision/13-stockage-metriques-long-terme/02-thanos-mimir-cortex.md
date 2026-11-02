---
title: Thanos, Grafana Mimir et Cortex
description: Solutions de stockage long terme et de vue globale pour Prometheus : Thanos (CNCF : sidecar, Store Gateway, Querier, Compactor, Ruler, Receive, stockage objet S3, déduplication, sous-échantillonnage), Grafana Mimir (AGPL, fork de Cortex : architecture en microservices ou monolithique, multi-locataires, ingestion remote_write, stockage objet, Helm mimir-distributed) et Cortex (CNCF, ancêtre de Mimir), installation, comparaison et critères de choix avec VictoriaMetrics.
tags: [thanos, mimir, cortex, prometheus, stockage objet, multi-locataires]
icon: info
---

| | **Thanos** | **Grafana Mimir** | Cortex | [[01-victoriametrics\|VictoriaMetrics]] |
| --- | --- | --- | --- | --- |
| Licence | Apache 2.0 | AGPL v3 | Apache 2.0 | Apache 2.0 (cluster libre) |
| Stockage | Objet (S3/MinIO) | Objet | Objet | Disque local |
| Intégration | **Sidecar** à côté de Prometheus existants (ou Receive) | `remote_write` | `remote_write` | `remote_write` ou vmagent |
| Multi-locataires | Limité | **Natif** | Natif | Cluster : oui |
| Complexité | Moyenne | Élevée (nombreux composants) | Élevée | Faible |

## Thanos (sidecar)

```yaml
# docker-compose (extrait) : chaque Prometheus a un sidecar qui envoie ses blocs dans S3
thanos-sidecar:
  image: quay.io/thanos/thanos:v0.37.2
  command: [sidecar, --prometheus.url=http://prometheus:9090, --tsdb.path=/prometheus, --objstore.config-file=/etc/thanos/s3.yml]
thanos-store:
  image: quay.io/thanos/thanos:v0.37.2
  command: [store, --objstore.config-file=/etc/thanos/s3.yml, --data-dir=/var/thanos/store]
thanos-query:
  image: quay.io/thanos/thanos:v0.37.2
  command: [query, --endpoint=thanos-sidecar:10901, --endpoint=thanos-store:10901, --query.replica-label=replica]
thanos-compactor:
  image: quay.io/thanos/thanos:v0.37.2
  command: [compact, --wait, --objstore.config-file=/etc/thanos/s3.yml, --retention.resolution-raw=90d, --retention.resolution-5m=1y, --retention.resolution-1h=5y]
```

```yaml
# /etc/thanos/s3.yml
type: S3
config: { bucket: thanos, endpoint: minio.corp.exemple.fr, access_key: THANOS, secret_key: SecretThanos2026 }
```

Prometheus doit avoir des `external_labels` (par exemple `cluster`, `replica`) et `--storage.tsdb.min-block-duration=2h --storage.tsdb.max-block-duration=2h`. Grafana interroge **Thanos Query** (API Prometheus, port 10902).

## Grafana Mimir

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install mimir grafana/mimir-distributed -n mimir --create-namespace -f valeurs-mimir.yaml   # stockage objet dans les valeurs
```

Prometheus ou [[17-opentelemetry-alloy/01-presentation-installation|Alloy]] envoient en `remote_write` vers `/api/v1/push` avec l'en-tête `X-Scope-OrgID` (locataire). Petit déploiement : mode **monolithique** (`-target=all`).

**Cortex** reste maintenu par la CNCF mais la plupart des nouveaux projets choisissent Mimir (même architecture, plus active) ou Thanos.

Commandes : [[90-aide-memoire|aide-mémoire]].

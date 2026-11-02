---
title: Quickwit et VictoriaLogs
description: Moteurs de journaux modernes à faible coût — Quickwit (Apache 2.0, Rust, moteur Tantivy : index et recherche plein texte directement sur stockage objet S3/MinIO, indexeurs et chercheurs sans état, ingestion OTLP, Kafka, API et compatibilité partielle Elasticsearch, intégration Grafana et Jaeger, installation binaire, Docker, Helm) et VictoriaLogs (Apache 2.0 : binaire unique très économe, ingestion Elasticsearch bulk, Loki, OpenTelemetry, syslog, langage LogsQL, champs à forte cardinalité sans coût, rétention, interface web vmui, source Grafana), configuration et exemples.
tags: [quickwit, victorialogs, journaux, recherche, stockage objet, logsql]
icon: info
---

| | **Quickwit** | **VictoriaLogs** |
| --- | --- | --- |
| Stockage | **Stockage objet** (S3, MinIO, GCS, Azure) | Disque local |
| Recherche | Plein texte indexée (Tantivy), agrégations | LogsQL (plein texte, filtres, statistiques) |
| Ingestion | API Elasticsearch `_bulk`, OTLP, Kafka, Pulsar, fichiers | Elasticsearch `_bulk`, API Loki, OTLP, syslog, JSON |
| Points forts | Volumes énormes, coût du stockage, nœuds sans état | Simplicité extrême, ressources minimes, forte cardinalité |

## Quickwit

```bash
curl -L https://install.quickwit.io | sh          # binaire (Linux, macOS) ; Docker : quickwit/quickwit
cd quickwit-v* && ./quickwit run                    # interface et API sur http://localhost:7280
```

```yaml
# config/quickwit.yaml — métastore et index sur MinIO
default_index_root_uri: s3://quickwit/indexes
metastore_uri: s3://quickwit/indexes
storage:
  s3: { endpoint: https://minio.corp.exemple.fr, force_path_style_access: true }
```

```bash
./quickwit index create --index-config journaux-nginx.yaml
curl -XPOST "http://localhost:7280/api/v1/journaux-nginx/ingest" --data-binary @lignes.ndjson
./quickwit index search --index journaux-nginx --query "status:500 AND chemin:/api*"
```

Les traces OpenTelemetry peuvent aussi y être stockées et consultées avec Jaeger ou Grafana.

## VictoriaLogs

```bash
# Binaire victoria-logs-prod (versions GitHub, Linux/macOS/Windows) ; Docker : victoriametrics/victoria-logs
./victoria-logs-prod -storageDataPath=/var/lib/victoria-logs -retentionPeriod=30d -httpListenAddr=:9428
```

```bash
# Ingestion compatible Elasticsearch (Filebeat, Vector, Fluent Bit), Loki (Alloy/Promtail) ou OTLP
curl -X POST 'http://vl:9428/insert/jsonline?_stream_fields=host,app&_msg_field=message&_time_field=ts' \
  -d '{"ts":"2026-11-02T10:00:00Z","host":"srv-web-01","app":"nginx","message":"GET /api 500"}'
curl -s 'http://vl:9428/select/logsql/query' -d 'query=_time:1h app:nginx "500" | stats by (host) count() erreurs'
```

Interface web : `http://vl:9428/select/vmui`. Grafana : greffon de source de données VictoriaLogs.

<!-- CAPTURE: VictoriaLogs — interface vmui, requête LogsQL | _assets/victorialogs-vmui.png -->
<!-- CAPTURE: Quickwit — interface de recherche | _assets/quickwit-ui.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

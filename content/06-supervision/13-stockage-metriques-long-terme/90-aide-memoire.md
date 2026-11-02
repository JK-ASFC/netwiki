---
title: VictoriaMetrics, Thanos, Mimir et Cortex — aide-mémoire
description: Commandes et API VictoriaMetrics (query, export, import, snapshot, delete_series, vmbackup, vmrestore, vmctl migrate, métriques internes), Thanos (tools bucket ls/inspect/web, query, compact, sidecar), Mimir (mimirtool rules/alertmanager/analyze, API) avec exemples.
tags: [aide-mémoire, victoriametrics, thanos, mimir]
icon: terminal
---

Explications : [[01-victoriametrics|VictoriaMetrics]] · [[02-thanos-mimir-cortex|Thanos, Mimir et Cortex]].

```bash
curl -s 'http://vm:8428/api/v1/query?query=sum(up)' ; curl -s 'http://vm:8428/api/v1/export?match[]=up' | head
curl -s http://vm:8428/snapshot/create ; curl -s 'http://vm:8428/api/v1/admin/tsdb/delete_series?match[]={job="ancien"}'
curl -s 'http://vm:8428/api/v1/status/tsdb' | jq '.data.seriesCountByMetricName[:10]'      # cardinalité
vmbackup -storageDataPath=/var/lib/victoria-metrics -snapshot.createURL=http://localhost:8428/snapshot/create -dst=fs:///sauv/vm
vmrestore -src=fs:///sauv/vm -storageDataPath=/var/lib/victoria-metrics
vmctl prometheus --prom-snapshot=/prometheus/snapshots/xxx --vm-addr=http://vm:8428     # migrer un historique Prometheus
thanos tools bucket ls --objstore.config-file=s3.yml ; thanos tools bucket inspect --objstore.config-file=s3.yml ; thanos tools bucket web --objstore.config-file=s3.yml
mimirtool rules load regles.yaml --address=http://mimir --id=locataire1 ; mimirtool analyze grafana --address=http://grafana --key=$JETON
```

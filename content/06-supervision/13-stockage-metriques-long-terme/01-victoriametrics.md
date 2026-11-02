---
title: VictoriaMetrics
description: VictoriaMetrics (Apache 2.0 pour la version libre) — base de séries temporelles compatible Prometheus, économe en ressources : versions mono-nœud et cluster (vminsert, vmselect, vmstorage), installation (binaire, paquets, Docker, Helm, opérateur), réception par remote_write et autres protocoles (InfluxDB, Graphite, OpenTSDB), vmagent (collecte et relais), vmalert (règles et alertes), MetricsQL, rétention, sauvegarde vmbackup/vmrestore, déduplication en haute disponibilité, source de données Grafana et comparaison avec Thanos et Mimir.
tags: [victoriametrics, prometheus, séries temporelles, vmagent, vmalert, métriques]
icon: info
---

**VictoriaMetrics** remplace ou complète le stockage de [[02-prometheus/01-presentation-installation|Prometheus]] pour conserver des **mois ou années** de métriques avec peu de disque et de mémoire. Il comprend PromQL (étendu en **MetricsQL**) : [[03-grafana/01-presentation-installation|Grafana]] s'y connecte comme à Prometheus.

| Composant | Rôle |
| --- | --- |
| **victoria-metrics** (mono-nœud) | Stockage + requêtes, un seul binaire (port 8428) — suffit pour la plupart des besoins |
| vminsert / vmselect / vmstorage | Version **cluster** (écriture, lecture, stockage séparés) |
| **vmagent** | Collecte (compatible configuration Prometheus) et relais `remote_write` avec tampon disque |
| **vmalert** | Évalue les règles d'alerte et d'enregistrement, envoie à Alertmanager |
| vmbackup / vmrestore | Sauvegarde vers S3, GCS, Azure ou disque |

## Installation (mono-nœud)

```bash
# Binaire des versions GitHub (Linux, macOS, Windows, FreeBSD) ; Docker : victoriametrics/victoria-metrics
sudo useradd -r -s /usr/sbin/nologin victoriametrics && sudo mkdir -p /var/lib/victoria-metrics && sudo chown victoriametrics /var/lib/victoria-metrics
sudo tee /etc/systemd/system/victoriametrics.service >/dev/null <<'UNIT'
[Unit]
Description=VictoriaMetrics
After=network-online.target
[Service]
User=victoriametrics
ExecStart=/usr/local/bin/victoria-metrics-prod -storageDataPath=/var/lib/victoria-metrics -retentionPeriod=24 -httpListenAddr=:8428 -dedup.minScrapeInterval=30s
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload && sudo systemctl enable --now victoriametrics
```

`-retentionPeriod=24` = 24 mois. Envoyer les données depuis Prometheus :

```yaml
# prometheus.yml
remote_write:
  - url: http://vm.corp.exemple.fr:8428/api/v1/write
```

Ou remplacer la collecte Prometheus par **vmagent** (`-promscrape.config=prometheus.yml -remoteWrite.url=…`). Deux Prometheus/vmagent identiques en haute disponibilité + `-dedup.minScrapeInterval` évitent les doublons.

```bash
curl -s 'http://vm:8428/api/v1/query?query=up' | jq '.data.result | length'
vmbackup -storageDataPath=/var/lib/victoria-metrics -snapshot.createURL=http://localhost:8428/snapshot/create -dst=s3://sauv-vm/quotidien
```

Interface intégrée **vmui** : `http://vm:8428/vmui` (requêtes, cardinalité, requêtes lentes).

Suite : [[02-thanos-mimir-cortex|Thanos, Mimir et Cortex]] · [[90-aide-memoire|aide-mémoire]].

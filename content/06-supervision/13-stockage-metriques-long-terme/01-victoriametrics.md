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

Interface intégrée **vmui** : `http://vm:8428/vmui` (requêtes, cardinalité via *Cardinality explorer*, requêtes lentes, graphe).

## vmagent : collecte et relais

`vmagent` remplace la collecte de Prometheus avec un tampon disque (aucune perte si la base est indisponible) et peut dédoubler l'écriture vers plusieurs destinations :

```bash
vmagent -promscrape.config=/etc/vmagent/scrape.yml \
  -remoteWrite.url=http://vm1:8428/api/v1/write \
  -remoteWrite.url=http://vm2:8428/api/v1/write \
  -remoteWrite.tmpDataPath=/var/lib/vmagent -remoteWrite.maxDiskUsagePerURL=10GB
```

Il accepte aussi le *push* : `remote_write` Prometheus, protocoles **InfluxDB** (`:8428/write`), **Graphite**, **OpenTSDB**, **DataDog**, OTLP — pratique pour migrer sans changer les agents existants.

## vmalert : règles et alertes

```bash
vmalert -datasource.url=http://vm:8428 \
  -remoteWrite.url=http://vm:8428 \          # où écrire les règles d'enregistrement
  -notifier.url=http://alertmanager:9093 \
  -rule=/etc/vmalert/*.yml                    # mêmes fichiers de règles que Prometheus
```

Les fichiers de règles sont **identiques** à ceux de Prometheus (`groups: [{ rules: [...] }]`). `-external.url` permet des liens cliquables depuis Alertmanager vers vmui.

## MetricsQL

MetricsQL est un sur-ensemble de PromQL, plus permissif et doté de fonctions supplémentaires : `rollup_rate`, `histogram_quantile` sur histogrammes natifs, `range_*`, `median_over_time`, intervalles par défaut implicites, `WITH (...)` pour factoriser une expression. Les requêtes PromQL existantes fonctionnent sans modification.

## Version cluster

| Composant | Rôle | Port |
| --- | --- | --- |
| `vminsert` | Reçoit les écritures, répartit sur les `vmstorage` | 8480 |
| `vmstorage` | Stocke les données | 8482/8400/8401 |
| `vmselect` | Exécute les requêtes en interrogeant les `vmstorage` | 8481 |

Écriture : `http://vminsert:8480/insert/0/prometheus/api/v1/write` ; lecture : `http://vmselect:8481/select/0/prometheus` (le `0` est l'identifiant de locataire — multi-locataires natif). Outil de migration `vmctl` (depuis Prometheus, InfluxDB, Thanos, OpenTSDB).

Suite : [[02-thanos-mimir-cortex|Thanos, Mimir et Cortex]] · [[90-aide-memoire|aide-mémoire]].

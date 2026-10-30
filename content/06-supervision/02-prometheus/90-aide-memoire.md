---
title: Prometheus — aide-mémoire des commandes
description: Commandes Prometheus avec exemples — vérification (promtool check config, check rules, test rules), rechargement (SIGHUP, /-/reload), API HTTP (query, query_range, targets, alerts, rules, series, labels, TSDB status), requêtes PromQL usuelles (taux, sommes, quantiles, disponibilité, CPU, disque), node_exporter et blackbox_exporter, Alertmanager (amtool : silences, alertes, vérification), instantanés et suppression de séries.
tags: [aide-mémoire, prometheus, promql, promtool, alertmanager, amtool]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Prometheus]].

## Vérification et rechargement

```bash
promtool check config /etc/prometheus/prometheus.yml
promtool check rules /etc/prometheus/rules/*.yml
promtool test rules tests/alertes_test.yml
promtool check metrics < metriques.txt                   # format d'exposition
sudo systemctl reload prometheus                          # SIGHUP
curl -X POST http://127.0.0.1:9090/-/reload               # avec --web.enable-lifecycle
curl -s http://127.0.0.1:9090/-/healthy && curl -s http://127.0.0.1:9090/-/ready
```

## API HTTP

```bash
P=http://127.0.0.1:9090/api/v1
curl -s "$P/query?query=up" | jq '.data.result[] | {instance: .metric.instance, job: .metric.job, val: .value[1]}'
curl -s "$P/query" --data-urlencode 'query=up == 0' | jq '.data.result[].metric.instance'
curl -s "$P/query_range" --data-urlencode 'query=rate(node_network_receive_bytes_total[5m])' \
  --data-urlencode "start=$(date -d '-1 hour' +%s)" --data-urlencode "end=$(date +%s)" --data-urlencode 'step=60' | jq '.data.result | length'
curl -s "$P/targets" | jq '.data.activeTargets[] | select(.health != "up") | {scrapeUrl, lastError}'
curl -s "$P/alerts" | jq '.data.alerts[] | {alertname: .labels.alertname, state}'
curl -s "$P/rules" | jq '.data.groups[].name'
curl -s "$P/labels" | jq .
curl -s "$P/label/job/values" | jq .
curl -s "$P/status/tsdb" | jq '.data.seriesCountByMetricName[0:10]'
promtool query instant http://127.0.0.1:9090 'count(up)'
```

## PromQL usuel

```promql
up == 0                                                             # cibles injoignables
rate(http_requests_total[5m])                                       # débit par seconde
sum by (job) (rate(http_requests_total{code=~"5.."}[5m]))           # erreurs 5xx par job
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)       # CPU %
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100               # mémoire %
100 - node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"} / node_filesystem_size_bytes * 100
predict_linear(node_filesystem_avail_bytes[6h], 24*3600) < 0       # disque plein dans 24 h
rate(node_network_receive_bytes_total{device="eth0"}[5m]) * 8      # bit/s
probe_success == 0                                                  # blackbox_exporter
avg_over_time(up[24h]) * 100                                        # disponibilité sur 24 h
topk(5, sum by (instance) (rate(node_disk_io_time_seconds_total[5m])))
```

## Exporteurs

```bash
curl -s http://10.0.30.10:9100/metrics | grep -E "^node_load1 |^node_filesystem_avail_bytes" | head
curl -s "http://127.0.0.1:9115/probe?target=https://www.exemple.fr&module=http_2xx" | grep probe_success
curl -s "http://127.0.0.1:9116/snmp?target=10.0.99.10&module=if_mib&auth=public_v2" | head    # snmp_exporter
```

## Alertmanager (amtool)

```bash
amtool check-config /etc/alertmanager/alertmanager.yml
amtool --alertmanager.url=http://127.0.0.1:9093 alert query
amtool --alertmanager.url=http://127.0.0.1:9093 silence add alertname=DisqueBientotPlein instance="srv-web01:9100" --duration=4h --comment="Extension du disque en cours"
amtool --alertmanager.url=http://127.0.0.1:9093 silence query
amtool --alertmanager.url=http://127.0.0.1:9093 silence expire <id>
amtool config routes test --config.file=/etc/alertmanager/alertmanager.yml severity=critical team=reseau
curl -X POST http://127.0.0.1:9093/-/reload
```

## Administration de la TSDB

```bash
# Nécessite --web.enable-admin-api
curl -X POST http://127.0.0.1:9090/api/v1/admin/tsdb/snapshot
curl -X POST -g 'http://127.0.0.1:9090/api/v1/admin/tsdb/delete_series?match[]={job="ancien"}'
curl -X POST http://127.0.0.1:9090/api/v1/admin/tsdb/clean_tombstones
promtool tsdb analyze /var/lib/prometheus
```

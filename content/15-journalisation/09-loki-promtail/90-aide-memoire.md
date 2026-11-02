---
title: Loki et Promtail — aide-mémoire des commandes
description: Commandes logcli (labels, series, query, instant-query, --since, --tail, --output), API Loki (ready, metrics, push, query_range, labels, delete), loki -verify-config, -print-config-stderr, Promtail (--dry-run, --inspect, positions) et Alloy (convert) avec exemples, et requêtes LogQL fréquentes.
tags: [aide-mémoire, loki, logcli, logql, promtail]
icon: terminal
---

Explications : [[01-loki|Loki]] · [[02-promtail-migration|Promtail et migration]].

```bash
export LOKI_ADDR=http://loki.corp.exemple.fr:3100
logcli labels ; logcli labels job ; logcli series '{job="nginx"}' ; logcli query '{job="nginx"} |= "500"' --since 1h --limit 50
logcli query --tail '{host="srv-web-01"}' ; logcli query '{job="sshd"}' --since 24h --output raw > sshd.log
logcli instant-query 'sum by (host) (count_over_time({job="sshd"} |= "Failed" [1h]))'
curl -s $LOKI_ADDR/ready ; curl -s $LOKI_ADDR/loki/api/v1/labels | jq . ; curl -s $LOKI_ADDR/metrics | grep loki_ingester_streams
loki -config.file=/etc/loki/config.yml -verify-config ; loki -config.file=/etc/loki/config.yml -print-config-stderr 2>&1 | head
promtail -config.file=/etc/promtail/config.yml --dry-run --inspect ; cat /var/lib/promtail/positions.yaml
alloy convert --source-format=promtail -o config.alloy /etc/promtail/config.yml
```

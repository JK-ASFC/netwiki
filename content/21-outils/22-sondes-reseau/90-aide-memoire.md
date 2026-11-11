---
title: Sondes réseau — aide-mémoire
description: Configuration et commandes de Smokeping (Targets, check, service), Blackbox Exporter (modules, requête /probe, scrape Prometheus, alertes PromQL) et fping exporter.
tags: [aide-mémoire, smokeping, blackbox exporter, fping, prometheus, latence]
icon: terminal
---

Explications : [[01-smokeping-blackbox|Smokeping, Blackbox Exporter et fping exporter]].

| Outil | Port | Données |
| --- | --- | --- |
| Smokeping | CGI Apache (`/smokeping`) | RRD |
| Blackbox Exporter | 9115 | via Prometheus |
| fping exporter | 9605 | via Prometheus |

```bash
# Smokeping
sudo smokeping --check ; sudo systemctl reload smokeping
sudo smokeping --debug                 # tester les sondes

# Blackbox Exporter
docker run -d -p 9115:9115 -v /srv/blackbox/blackbox.yml:/etc/blackbox_exporter/config.yml prom/blackbox-exporter:latest
curl 'http://127.0.0.1:9115/probe?module=icmp&target=192.0.2.1' | grep probe_success
curl 'http://127.0.0.1:9115/probe?module=http_2xx&target=https://intranet.exemple.fr' | grep -E 'probe_success|cert_expiry'

# fping exporter
docker run -d --cap-add NET_RAW -p 9605:9605 czerwonk/ping_exporter --config.path=/config/config.yml
curl -s localhost:9605/metrics | grep -E 'ping_rtt_seconds|ping_loss_ratio'
```

```promql
probe_success == 0
probe_ssl_earliest_cert_expiry - time() < 15*24*3600
ping_loss_ratio > 0.1
```

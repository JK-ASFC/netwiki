---
title: Apache Traffic Server — aide-mémoire des commandes
description: Commandes ATS avec exemples — traffic_ctl (config reload, get, set, diff, status ; metric get, match, clear ; server restart, drain ; host status ; plugin msg), traffic_top, traffic_logstats, traffic_cache_tool, PURGE, journaux et fichiers de configuration.
tags: [aide-mémoire, apache traffic server, ats, traffic_ctl]
icon: terminal
---

Explications : [[01-presentation-installation|Apache Traffic Server]].

## traffic_ctl

```bash
sudo traffic_ctl config reload
sudo traffic_ctl config get proxy.config.http.server_ports
sudo traffic_ctl config set proxy.config.http.cache.http 1
sudo traffic_ctl config diff                       # écarts avec les valeurs par défaut
sudo traffic_ctl config status
sudo traffic_ctl metric get proxy.process.http.completed_requests
sudo traffic_ctl metric match 'proxy.process.cache.*'
sudo traffic_ctl metric clear
sudo traffic_ctl server restart
sudo traffic_ctl server drain                      # sortir proprement de la production
sudo traffic_ctl host down cache-p1.corp.exemple.fr
sudo traffic_ctl host status cache-p1.corp.exemple.fr
```

## Outils

```bash
traffic_top
sudo traffic_logstats -f /var/log/trafficserver/squid.log | head -40
sudo tail -f /var/log/trafficserver/diags.log /var/log/trafficserver/error.log
curl -sI -x http://127.0.0.1:8080 https://www.corp.exemple.fr/ | grep -i -E 'age|via|x-cache'
curl -X PURGE -H "Host: www.corp.exemple.fr" http://127.0.0.1/index.html
ls /etc/trafficserver/
```

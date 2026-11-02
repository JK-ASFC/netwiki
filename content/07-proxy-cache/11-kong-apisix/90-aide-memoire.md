---
title: Kong et APISIX — aide-mémoire des commandes
description: Commandes Kong (kong start/stop/reload/check/health, migrations, config parse et db_export, API d'administration /status /services /routes /consumers /plugins, decK dump/diff/sync/validate) et APISIX (apisix start/stop/reload/test, API d'administration /apisix/admin/routes upstreams consumers plugins, métriques, ADC) avec exemples.
tags: [aide-mémoire, kong, apisix, deck, api gateway]
icon: terminal
---

Explications : [[01-kong|Kong]] · [[02-apisix|APISIX]].

## Kong

```bash
kong version ; kong health
kong check /etc/kong/kong.conf
kong config parse /kong/kong.yml                 # valider une configuration déclarative
kong reload
kong migrations bootstrap ; kong migrations up ; kong migrations finish
curl -s localhost:8001/status | jq .
curl -s localhost:8001/services | jq '.data[].name'
curl -s localhost:8001/plugins/enabled | jq .
curl -s -X DELETE localhost:8001/routes/stock
deck gateway validate kong.yml ; deck gateway diff kong.yml ; deck gateway sync kong.yml
docker logs -f kong
```

## APISIX

```bash
apisix version ; apisix test                     # tester la configuration
apisix start ; apisix reload ; apisix stop
curl -s http://127.0.0.1:9180/apisix/admin/routes -H "X-API-KEY: $APISIX_ADMIN_KEY" | jq '.list[].value | {id, uri}'
curl -s http://127.0.0.1:9180/apisix/admin/plugins/list -H "X-API-KEY: $APISIX_ADMIN_KEY" | jq .
curl -s -X DELETE http://127.0.0.1:9180/apisix/admin/routes/commandes -H "X-API-KEY: $APISIX_ADMIN_KEY"
curl -s http://127.0.0.1:9091/apisix/prometheus/metrics | head
adc ping ; adc dump -o adc.yaml ; adc diff -f adc.yaml ; adc sync -f adc.yaml
tail -f /usr/local/apisix/logs/error.log
```

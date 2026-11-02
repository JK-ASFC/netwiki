---
title: Envoy — aide-mémoire des commandes
description: Commandes Envoy avec exemples — envoy --version, -c, --mode validate, --log-level, --component-log-level, --base-id et --restart-epoch (redémarrage à chaud), points d'administration (/ready, /server_info, /clusters, /stats, /stats/prometheus, /config_dump, /listeners, /logging, /healthcheck/fail, /drain_listeners, /quitquitquit), Docker et Istio (istioctl proxy-config).
tags: [aide-mémoire, envoy, proxy, administration]
icon: terminal
---

Explications : [[01-presentation-installation|Envoy]].

## Binaire

```bash
envoy --version
envoy -c /etc/envoy/envoy.yaml --mode validate
envoy -c /etc/envoy/envoy.yaml --log-level info --component-log-level upstream:debug,router:debug
envoy -c /etc/envoy/envoy.yaml --restart-epoch 1 --base-id 0     # redémarrage à chaud (avec le script hot-restarter)
docker logs -f envoy
```

## Interface d'administration (port 9901, en local)

```bash
curl -s localhost:9901/ready
curl -s localhost:9901/server_info | jq '.state, .version'
curl -s localhost:9901/listeners
curl -s localhost:9901/clusters | grep -E 'health_flags|cx_active'
curl -s 'localhost:9901/stats?filter=^cluster\.web\.' | head
curl -s localhost:9901/stats/prometheus
curl -s 'localhost:9901/config_dump?resource=dynamic_active_clusters' | jq .
curl -s -X POST 'localhost:9901/logging?level=debug'
curl -s -X POST localhost:9901/healthcheck/fail      # se retirer d'un répartiteur avant maintenance
curl -s -X POST localhost:9901/drain_listeners
curl -s -X POST localhost:9901/quitquitquit
```

## Avec Istio

```bash
istioctl proxy-status
istioctl proxy-config clusters deploy/web -n prod
istioctl proxy-config routes deploy/web -n prod -o json
kubectl exec deploy/web -n prod -c istio-proxy -- pilot-agent request GET stats | head
```

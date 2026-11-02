---
title: Apache APISIX
description: Apache APISIX — passerelle d'API dynamique de la fondation Apache (OpenResty + etcd) : architecture (plan de données, etcd, API d'administration port 9180), installation Docker Compose, paquets RPM/DEB (repos.apiseven.com), Kubernetes (Helm, APISIX Ingress Controller), mode autonome (apisix.yaml), routes, upstreams, services, consommateurs, greffons (key-auth, jwt-auth, openid-connect, limit-count, limit-req, proxy-rewrite, cors, prometheus), configuration déclarative ADC, tableau de bord intégré et sécurité de la clé d'administration.
tags: [apisix, api gateway, passerelle api, etcd, openresty, kubernetes, apache]
icon: info
---

**Apache APISIX** (Apache 2.0) est une passerelle d'API **entièrement dynamique** : routes, upstreams et greffons sont stockés dans **etcd** et appliqués en quelques millisecondes, sans rechargement. Elle propose plus de 80 greffons (authentification, sécurité, trafic, observabilité) et un mode autonome sans etcd.

## Installation (Docker Compose)

```bash
git clone https://github.com/apache/apisix-docker.git && cd apisix-docker/example
docker compose -p apisix up -d          # APISIX + etcd (+ Prometheus/Grafana d'exemple)
```

Paquets : RPM (`sudo dnf install https://repos.apiseven.com/packages/centos/apache-apisix-repo-1.0-1.noarch.rpm && sudo dnf install apisix`) ou dépôt DEB de `repos.apiseven.com` ; etcd séparé. Kubernetes : chart Helm `apisix/apisix` et **APISIX Ingress Controller**.

Ports : **9080/9443** (trafic), **9180** (API d'administration), 9091 (métriques Prometheus).

> [!WARNING]
> Changez la clé d'administration par défaut (`deployment.admin.admin_key` dans `conf/config.yaml`) et restreignez `allow_admin` aux adresses d'administration : une clé connue donne le contrôle de la passerelle.

## Créer une route

```bash
ADMIN="X-API-KEY: $APISIX_ADMIN_KEY"
curl -s http://127.0.0.1:9180/apisix/admin/upstreams/commandes -H "$ADMIN" -X PUT -d '{
  "type": "roundrobin",
  "nodes": { "10.0.20.10:8080": 1, "10.0.20.12:8080": 1 },
  "checks": { "active": { "http_path": "/sante", "healthy": { "interval": 5 }, "unhealthy": { "interval": 2, "http_failures": 3 } } }
}'
curl -s http://127.0.0.1:9180/apisix/admin/routes/commandes -H "$ADMIN" -X PUT -d '{
  "uri": "/commandes/*",
  "upstream_id": "commandes",
  "plugins": {
    "key-auth": {},
    "limit-count": { "count": 60, "time_window": 60, "rejected_code": 429 },
    "proxy-rewrite": { "regex_uri": ["^/commandes/(.*)", "/api/v1/$1"] }
  }
}'
curl -s http://127.0.0.1:9180/apisix/admin/consumers -H "$ADMIN" -X PUT -d '{
  "username": "appli_mobile", "plugins": { "key-auth": { "key": "cle-appli-mobile-2026" } }
}'
curl -i http://127.0.0.1:9080/commandes/123 -H "apikey: cle-appli-mobile-2026"
```

## Configuration déclarative

- **Mode autonome** : `deployment.role_data_plane.config_provider: yaml` et fichier `conf/apisix.yaml` (rechargé automatiquement), sans etcd.
- **ADC** (*APISIX Declarative CLI*) : `adc dump`, `adc diff`, `adc sync -f adc.yaml` pour gérer la configuration dans Git.

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].

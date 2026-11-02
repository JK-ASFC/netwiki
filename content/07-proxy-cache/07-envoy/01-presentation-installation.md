---
title: Présentation, installation et configuration
description: Envoy Proxy — proxy L4/L7 de la CNCF écrit en C++ : architecture (listeners, filter chains, http_connection_manager, routes, clusters, endpoints), installation Debian/Ubuntu (apt.envoyproxy.io), RHEL, macOS (Homebrew), Docker, Windows via conteneur ou WSL, configuration statique YAML v3 (reverse proxy HTTP, TLS, équilibrage, contrôles de santé, disjoncteurs, réessais, limitation de débit), interface d'administration (port 9901), observabilité (statistiques, Prometheus, traces, journaux d'accès), configuration dynamique xDS et écosystème (Istio, Envoy Gateway, Contour, Gloo).
tags: [envoy, proxy, reverse proxy, l7, xds, service mesh, istio, cncf]
icon: info
---

**Envoy** (Apache 2.0, CNCF) est le proxy des **maillages de services** (Istio, Consul Connect) et de nombreuses passerelles (Envoy Gateway, Contour, Emissary) : performant, entièrement **piloté par API** (xDS), très riche en observabilité. Utilisé seul, c'est un reverse proxy L4/L7 puissant mais plus verbeux que [[01-haproxy/01-presentation|HAProxy]] ou [[03-nginx/01-presentation|NGINX]].

| Notion | Rôle |
| --- | --- |
| **Listener** | Adresse et port d'écoute, chaînes de filtres |
| **Filtres réseau** | `http_connection_manager` (HTTP), `tcp_proxy`, Redis, MySQL… |
| **Filtres HTTP** | `router` (obligatoire, en dernier), JWT, RBAC, CORS, compression, limitation de débit, ext_authz |
| **Route** | Correspondance (domaine, préfixe, en-têtes) → cluster, réécritures, réessais, délais |
| **Cluster** | Groupe d'**endpoints** amont : découverte (STATIC, STRICT_DNS, EDS), algorithme d'équilibrage, contrôles de santé, disjoncteurs |
| **xDS** | API de configuration dynamique (LDS, RDS, CDS, EDS, SDS) servie par un plan de contrôle |

## Installation

```bash
# Debian/Ubuntu — dépôt officiel
sudo mkdir -p /etc/apt/keyrings
wget -O- https://apt.envoyproxy.io/signing.key | sudo gpg --dearmor -o /etc/apt/keyrings/envoy-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/envoy-keyring.gpg] https://apt.envoyproxy.io $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/envoy.list
sudo apt update && sudo apt install envoy
envoy --version
```

```bash
brew install envoy                                            # macOS
docker run -d --name envoy -p 10000:10000 -p 9901:9901 \
  -v ./envoy.yaml:/etc/envoy/envoy.yaml envoyproxy/envoy:v1.34-latest   # toutes plates-formes (Windows via Docker Desktop/WSL)
```

RHEL/Rocky : utiliser l'image conteneur ou le binaire extrait de l'image (pas de dépôt RPM officiel maintenu).

## Configuration statique (`/etc/envoy/envoy.yaml`)

```yaml
admin:
  address:
    socket_address: { address: 127.0.0.1, port_value: 9901 }
static_resources:
  listeners:
    - name: http_entrant
      address:
        socket_address: { address: 0.0.0.0, port_value: 10000 }
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                stat_prefix: entrant
                access_log:
                  - name: envoy.access_loggers.stdout
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.access_loggers.stream.v3.StdoutAccessLog
                route_config:
                  virtual_hosts:
                    - name: intranet
                      domains: ["intranet.corp.exemple.fr"]
                      routes:
                        - match: { prefix: "/api/" }
                          route: { cluster: api, timeout: 15s, retry_policy: { retry_on: "5xx", num_retries: 2 } }
                        - match: { prefix: "/" }
                          route: { cluster: web }
                http_filters:
                  - name: envoy.filters.http.router
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
  clusters:
    - name: web
      type: STRICT_DNS
      lb_policy: ROUND_ROBIN
      load_assignment:
        cluster_name: web
        endpoints:
          - lb_endpoints:
              - endpoint: { address: { socket_address: { address: srv-web-01.corp.exemple.fr, port_value: 8080 } } }
              - endpoint: { address: { socket_address: { address: srv-web-02.corp.exemple.fr, port_value: 8080 } } }
      health_checks:
        - timeout: 2s
          interval: 5s
          unhealthy_threshold: 3
          healthy_threshold: 2
          http_health_check: { path: /sante }
    - name: api
      type: STRICT_DNS
      lb_policy: LEAST_REQUEST
      circuit_breakers:
        thresholds: [{ max_connections: 1000, max_pending_requests: 200 }]
      load_assignment:
        cluster_name: api
        endpoints:
          - lb_endpoints:
              - endpoint: { address: { socket_address: { address: srv-api-01.corp.exemple.fr, port_value: 9000 } } }
```

```bash
envoy -c /etc/envoy/envoy.yaml --mode validate     # valider sans démarrer
sudo systemctl restart envoy                       # ou envoy -c … en premier plan
```

TLS côté client : `transport_socket` de type `DownstreamTlsContext` sur la chaîne de filtres (certificats fichiers ou SDS) ; TLS vers l'amont : `UpstreamTlsContext` sur le cluster.

## Administration et observabilité

L'interface d'administration (jamais exposée publiquement) donne l'état interne :

```bash
curl -s localhost:9901/ready
curl -s localhost:9901/clusters | grep health_flags
curl -s localhost:9901/stats/prometheus | head          # métriques pour Prometheus
curl -s localhost:9901/config_dump | jq '.configs[].["@type"]'
curl -s -X POST "localhost:9901/logging?level=debug"
```

Traces distribuées (OpenTelemetry, Zipkin), journaux d'accès personnalisables (format JSON vers [[03-fluent-bit/01-presentation-installation|Fluent Bit]]).

## Configuration dynamique et écosystème

En production, Envoy reçoit sa configuration d'un **plan de contrôle** via xDS : **Istio** (maillage Kubernetes), **Envoy Gateway** (API Gateway de Kubernetes), Contour, Gloo, ou un plan de contrôle maison (`go-control-plane`). Commandes : [[90-aide-memoire|aide-mémoire]].

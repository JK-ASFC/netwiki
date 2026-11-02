---
title: Présentation, installation et utilisation
description: Dapr (CNCF) — runtime d'applications distribuées qui fournit des blocs prêts à l'emploi par un sidecar HTTP/gRPC : invocation de services, gestion d'état, publication/abonnement, liaisons d'entrée et de sortie, acteurs, secrets, configuration, workflows ; composants interchangeables (Redis, Kafka, PostgreSQL, Azure, AWS) ; installation de la CLI (Windows, Linux, macOS), mode autonome (dapr init) et Kubernetes (dapr init -k ou Helm), fichiers de composants, mTLS, observabilité et tableau de bord.
tags: [dapr, microservices, sidecar, pub/sub, kubernetes, cncf]
icon: info
---

**Dapr** (*Distributed Application Runtime*) évite aux développeurs de coder eux-mêmes les briques des applications distribuées : chaque service parle à son **sidecar** Dapr (`localhost:3500`), qui se charge de l'état, des messages, des appels entre services (avec **mTLS** et réessais) et des secrets. Changer de technologie (de Redis à PostgreSQL, de [[04-kafka/01-presentation-installation|Kafka]] à [[03-rabbitmq/01-presentation-installation|RabbitMQ]]) se fait en modifiant un **composant** YAML, pas le code.

## Installation

| Système | CLI |
| --- | --- |
| Linux | `wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - \| /bin/bash` |
| Windows | `winget install Dapr.CLI` |
| macOS | `brew install dapr/tap/dapr-cli` |

```bash
dapr init                      # mode autonome : conteneurs Redis, Zipkin, placement (Docker requis)
dapr run --app-id inventaire --app-port 8000 --dapr-http-port 3500 -- python app.py
dapr init -k --wait            # sur Kubernetes (ou Helm : dapr/dapr dans dapr-system)
dapr status -k
```

## Composant et utilisation

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata: { name: etat, namespace: inventaire }
spec:
  type: state.postgresql
  version: v1
  metadata:
    - name: connectionString
      secretKeyRef: { name: pg-inventaire, key: dsn }
```

```bash
curl -X POST http://localhost:3500/v1.0/state/etat -H 'Content-Type: application/json' -d '[{"key":"sw-coeur-01","value":{"site":"paris"}}]'
curl http://localhost:3500/v1.0/state/etat/sw-coeur-01
curl -X POST http://localhost:3500/v1.0/invoke/facturation/method/factures -d '{"client":42}'
```

Sur Kubernetes, l'injection du sidecar se fait par annotations du pod (`dapr.io/enabled: "true"`, `dapr.io/app-id`, `dapr.io/app-port`). Observabilité : traces (OpenTelemetry/Zipkin), métriques Prometheus, `dapr dashboard -k`.

Commandes : [[90-aide-memoire|aide-mémoire]].

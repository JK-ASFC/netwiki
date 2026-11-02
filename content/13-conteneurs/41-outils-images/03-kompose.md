---
title: Kompose
description: Kompose — conversion de fichiers Docker Compose en manifestes Kubernetes (Deployment, Service, PersistentVolumeClaim, ConfigMap) ou chart Helm : installation (Windows, Linux, macOS), kompose convert (-f, -o, --chart, --volumes), étiquettes kompose.* pour piloter la conversion (type de service, exposition, réplicas), limites et relecture nécessaire, et démarche de migration Compose vers Kubernetes.
tags: [kompose, docker compose, kubernetes, migration, helm]
icon: info
---

**Kompose** donne un **point de départ** pour migrer une application décrite en [[01-docker/04-compose|Docker Compose]] vers Kubernetes. Le résultat doit toujours être **relu** : sondes, ressources, sécurité et stockage ne se devinent pas.

```bash
# Linux/macOS : binaire GitHub ou brew install kompose ; Windows : choco install kubernetes-kompose ou binaire
kompose convert -f compose.yaml -o k8s/                 # manifestes
kompose convert -f compose.yaml --chart -o chart/       # chart Helm
```

```yaml
# compose.yaml — étiquettes pour orienter la conversion
services:
  web:
    image: registry.corp.exemple.fr/infra/inventaire:1.8.2
    ports: ["8080:8080"]
    labels:
      kompose.service.type: ClusterIP
      kompose.service.expose: inventaire.corp.exemple.fr       # génère un Ingress
      kompose.controller.type: deployment
    deploy: { replicas: 2 }
  base:
    image: postgres:16
    volumes: ["donnees:/var/lib/postgresql/data"]
volumes:
  donnees:
```

À ajouter à la main après conversion : `resources`, sondes `readinessProbe`/`livenessProbe`, `securityContext`, secrets (au lieu de variables en clair), classe de stockage, et pour les bases de données plutôt un **opérateur** ou un chart éprouvé qu'un simple Deployment.

Commandes : [[90-aide-memoire|aide-mémoire]].

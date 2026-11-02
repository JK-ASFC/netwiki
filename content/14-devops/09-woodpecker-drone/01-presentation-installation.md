---
title: Présentation, installation et pipelines
description: Woodpecker CI (fork communautaire de Drone, Apache 2.0) et Drone CI — intégration continue légère dont chaque étape s'exécute dans un conteneur : architecture serveur et agents, installation Docker Compose, liaison OAuth avec Gitea, Forgejo, GitLab, GitHub ou Bitbucket, secret partagé des agents, administrateurs, fichiers .woodpecker.yaml et .drone.yml (étapes, services, conditions when, matrices), secrets, agents Docker, Kubernetes et local, état de Drone (Harness) et choix entre les deux.
tags: [woodpecker, drone, ci, conteneurs, gitea, forgejo, pipelines]
icon: info
---

**Woodpecker** et **Drone** lisent un fichier YAML du dépôt et exécutent chaque **étape dans un conteneur** : rien à installer sur les agents à part Docker. Ils se branchent sur la forge par OAuth et conviennent parfaitement à [[03-gitea/01-presentation-installation|Gitea]] ou [[04-forgejo/01-presentation-installation|Forgejo]].

| | **Woodpecker** | Drone |
| --- | --- | --- |
| Licence | Apache 2.0, communautaire | Code sous licences mixtes ; édition communautaire limitée, projet repris par Harness |
| Fichier | `.woodpecker.yaml` ou `.woodpecker/*.yaml` | `.drone.yml` |
| Recommandation | Nouveau projet auto-hébergé | Installations existantes |

## Installation de Woodpecker (Docker Compose)

```yaml
# docker-compose.yml — application OAuth créée dans Gitea/Forgejo avec l'URL de rappel https://ci.corp.exemple.fr/authorize
services:
  woodpecker-server:
    image: woodpeckerci/woodpecker-server:v3
    ports: ["8000:8000"]
    volumes: ["woodpecker-data:/var/lib/woodpecker"]
    environment:
      WOODPECKER_HOST: https://ci.corp.exemple.fr
      WOODPECKER_OPEN: "false"
      WOODPECKER_ADMIN: jk
      WOODPECKER_FORGEJO: "true"                 # ou WOODPECKER_GITEA / _GITLAB / _GITHUB
      WOODPECKER_FORGEJO_URL: https://git.corp.exemple.fr
      WOODPECKER_FORGEJO_CLIENT: ${OAUTH_ID}
      WOODPECKER_FORGEJO_SECRET: ${OAUTH_SECRET}
      WOODPECKER_AGENT_SECRET: ${AGENT_SECRET}
  woodpecker-agent:
    image: woodpeckerci/woodpecker-agent:v3
    command: agent
    depends_on: [woodpecker-server]
    volumes: ["/var/run/docker.sock:/var/run/docker.sock"]
    environment:
      WOODPECKER_SERVER: woodpecker-server:9000
      WOODPECKER_AGENT_SECRET: ${AGENT_SECRET}
      WOODPECKER_MAX_WORKFLOWS: 4
volumes:
  woodpecker-data:
```

```bash
openssl rand -hex 32        # AGENT_SECRET
docker compose up -d
```

Publier `8000` derrière un reverse proxy TLS ; les agents distants se connectent en gRPC sur **9000**. Agents disponibles : Docker, **Kubernetes** (une étape = un pod), *local* (exécution directe, Windows et macOS).

## Pipeline

```yaml
# .woodpecker.yaml
when:
  - event: [push, pull_request]
    branch: main
steps:
  - name: lint
    image: cytopia/ansible-lint
    commands:
      - ansible-lint
  - name: tests
    image: python:3.12
    commands:
      - pip install -r requirements.txt
      - pytest -q
  - name: image
    image: woodpeckerci/plugin-docker-buildx
    settings:
      repo: registry.corp.exemple.fr/infra/collecteur
      registry: registry.corp.exemple.fr
      tags: latest
      username: ci
      password:
        from_secret: registre_mdp
    when:
      - event: push
services:
  - name: base
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: test
```

Drone : syntaxe très proche (`kind: pipeline`, `type: docker`, `steps:` et `trigger:`), serveur `drone/drone` avec `DRONE_GITEA_SERVER`, `DRONE_RPC_SECRET`, agent `drone/drone-runner-docker`.

> [!WARNING]
> Un agent Docker monte le socket Docker : un pipeline peut prendre le contrôle de l'hôte. Réservez les agents aux dépôts de confiance (option *trusted*), n'exécutez pas les PR de forks avec des secrets, et isolez les agents sur des machines dédiées.

Interface : [[03-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].

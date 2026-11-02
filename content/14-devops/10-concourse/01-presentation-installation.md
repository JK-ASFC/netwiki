---
title: Présentation, installation et pipelines
description: Concourse CI — CI/CD déclarative et sans état (Apache 2.0) : concepts (ressources, jobs, tâches, plans get/put/task, versions), architecture (web, workers, PostgreSQL), installation Docker Compose de démonstration, binaires et Helm pour la production, CLI fly (login, set-pipeline, unpause, trigger-job, watch, intercept, execute), exemple de pipeline YAML, gestion des secrets (Vault, CredHub, Kubernetes), équipes et authentification.
tags: [concourse, ci, cd, fly, pipelines, conteneurs]
icon: info
---

**Concourse** décrit tout dans un fichier YAML de pipeline : des **ressources** (dépôt Git, image, fichier S3, minuterie) dont chaque nouvelle **version** déclenche des **jobs** composés de **tâches** exécutées dans des conteneurs. Aucun état caché sur les workers : un pipeline est reproductible et versionné.

## Installation

```bash
# Démonstration
curl -O https://concourse-ci.org/docker-compose.yml && docker compose up -d   # http://localhost:8080 (test / test)
```

Production : binaire `concourse` (rôles `web` et `worker`), PostgreSQL, clés générées par `concourse generate-key`, ou chart **Helm** `concourse/concourse` sur Kubernetes. Les workers sont Linux (containerd) ; des workers Windows et macOS existent pour les tâches sans conteneur.

```bash
# CLI fly : téléchargeable depuis l'interface web (icônes en bas à droite)
fly -t corp login -c https://ci.corp.exemple.fr -n infra
fly -t corp sync                                  # aligner fly sur la version du serveur
```

## Pipeline

```yaml
# pipeline.yml
resources:
  - name: depot
    type: git
    source: { uri: https://git.corp.exemple.fr/infra/outils.git, branch: main }
  - name: chaque-nuit
    type: time
    source: { start: 1:00 AM, stop: 2:00 AM, location: Europe/Paris }
jobs:
  - name: tests
    plan:
      - get: depot
        trigger: true
      - get: chaque-nuit
        trigger: true
      - task: lint
        config:
          platform: linux
          image_resource: { type: registry-image, source: { repository: cytopia/ansible-lint } }
          inputs: [{ name: depot }]
          run: { dir: depot, path: ansible-lint }
```

```bash
fly -t corp set-pipeline -p outils -c pipeline.yml -v branche=main
fly -t corp unpause-pipeline -p outils
fly -t corp trigger-job -j outils/tests --watch
fly -t corp intercept -j outils/tests -s lint      # shell dans le conteneur d'une étape
fly -t corp execute -c tache.yml -i depot=.        # exécuter une tâche avec les fichiers locaux
```

Secrets : `((registre.mdp))` résolus depuis Vault, CredHub, Kubernetes ou AWS ; jamais dans le YAML. Équipes : `fly set-team` avec authentification locale, OIDC, LDAP ou GitHub.

Commandes : [[90-aide-memoire|aide-mémoire]].

<!-- CAPTURE: Concourse — vue graphique d'un pipeline | _assets/concourse-pipeline.png -->

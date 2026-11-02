---
title: Concourse — aide-mémoire des commandes fly
description: Commandes fly avec exemples — login, targets, sync, teams, set-team, pipelines, set-pipeline, validate-pipeline, get-pipeline, pause/unpause-pipeline, destroy-pipeline, jobs, trigger-job, builds, watch, abort-build, intercept, execute, check-resource, workers, prune-worker, containers, volumes.
tags: [aide-mémoire, concourse, fly]
icon: terminal
---

Explications : [[01-presentation-installation|Concourse]].

```bash
fly -t corp login -c https://ci.corp.exemple.fr -n infra ; fly targets ; fly -t corp sync ; fly -t corp status
fly -t corp teams ; fly -t corp set-team -n infra --ldap-group=GG-CI-Infra
fly -t corp pipelines ; fly validate-pipeline -c pipeline.yml ; fly -t corp set-pipeline -p outils -c pipeline.yml -l vars.yml
fly -t corp get-pipeline -p outils > sauvegarde.yml ; fly -t corp pause-pipeline -p outils ; fly -t corp destroy-pipeline -p ancien
fly -t corp jobs -p outils ; fly -t corp trigger-job -j outils/tests -w ; fly -t corp builds -j outils/tests ; fly -t corp watch -j outils/tests
fly -t corp abort-build -j outils/tests -b 42 ; fly -t corp intercept -j outils/tests ; fly -t corp execute -c tache.yml -i depot=.
fly -t corp check-resource -r outils/depot ; fly -t corp workers ; fly -t corp prune-worker -w worker-ancien ; fly -t corp containers ; fly -t corp volumes
```

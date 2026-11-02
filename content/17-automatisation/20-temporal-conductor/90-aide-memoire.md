---
title: Temporal et Conductor — aide-mémoire des commandes
description: Commandes temporal (server start-dev, operator namespace create/list, workflow start/list/describe/show/signal/query/cancel/terminate/reset, task-queue describe, schedule create/list) et API Conductor (métadonnées, démarrage, statut, relance) avec exemples.
tags: [aide-mémoire, temporal, conductor]
icon: terminal
---

Explications : [[01-presentation-installation|Temporal et Conductor]].

```bash
temporal server start-dev ; temporal operator namespace create --namespace infra ; temporal operator namespace list
temporal workflow start --task-queue provisionnement --type Provisionnement --workflow-id vm-srv-app-07 --input '"srv-app-07"'
temporal workflow list --query 'ExecutionStatus="Running"' ; temporal workflow describe --workflow-id vm-srv-app-07 ; temporal workflow show --workflow-id vm-srv-app-07
temporal workflow signal --workflow-id ID --name approuver --input true ; temporal workflow query --workflow-id ID --type etat
temporal workflow cancel --workflow-id ID ; temporal workflow terminate --workflow-id ID --reason "erreur de saisie" ; temporal workflow reset --workflow-id ID --type FirstWorkflowTask
temporal task-queue describe --task-queue provisionnement ; temporal schedule create --schedule-id nettoyage --cron "0 4 * * *" --workflow-type Nettoyage --task-queue maintenance
curl -s http://localhost:8080/api/metadata/workflow | jq '.[].name' ; curl -s -X POST http://localhost:8080/api/workflow/mon_workflow -H 'Content-Type: application/json' -d '{}'
```

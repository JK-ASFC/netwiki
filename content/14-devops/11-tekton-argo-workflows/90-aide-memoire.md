---
title: Tekton et Argo Workflows — aide-mémoire des commandes
description: Commandes tkn (task, pipeline start, pipelinerun list/logs/describe/cancel/delete, taskrun, hub, bundle, version) et argo (submit, list, get, logs, watch, retry, resubmit, stop, terminate, delete, template, cron, lint, archive) avec exemples, et commandes kubectl associées.
tags: [aide-mémoire, tekton, tkn, argo, argo workflows]
icon: terminal
---

Explications : [[01-tekton|Tekton]] · [[02-argo-workflows|Argo Workflows]].

## Tekton

```bash
tkn version ; tkn task list ; tkn pipeline list ; tkn pipeline describe outils
tkn pipeline start outils -p depot=URL -w name=partage,claimName=pvc-ci --showlog
tkn pipelinerun list ; tkn pipelinerun logs -f outils-run-abc12 ; tkn pipelinerun describe --last
tkn pipelinerun cancel outils-run-abc12 ; tkn pipelinerun delete --keep 20 -f
tkn taskrun list ; tkn taskrun logs --last -f
kubectl get pipelineruns,taskruns -A ; kubectl get pods -n tekton-pipelines
```

## Argo Workflows

```bash
argo version ; argo lint workflow.yaml
argo submit -n argo workflow.yaml -p site=paris --watch ; argo submit -n argo --from workflowtemplate/sauvegarde
argo list -n argo --running ; argo get -n argo @latest ; argo logs -n argo @latest -f ; argo watch -n argo @latest
argo retry -n argo NOM ; argo resubmit -n argo NOM ; argo stop -n argo NOM ; argo terminate -n argo NOM ; argo delete -n argo --older 7d
argo template list -n argo ; argo cron list -n argo ; argo cron suspend -n argo NOM ; argo cron resume -n argo NOM
argo archive list -n argo
```

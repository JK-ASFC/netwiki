---
title: Interfaces graphiques
description: Tekton Dashboard (PipelineRuns, TaskRuns, journaux, création de runs, mode lecture seule) et interface d'Argo Workflows (port 2746 : Workflows, graphe DAG, journaux, Workflow Templates, Cron Workflows, Event Sources, Archived Workflows), avec emplacements de captures d'écran.
tags: [tekton dashboard, argo workflows, interface graphique, kubernetes, captures]
icon: monitor
---

## Tekton Dashboard

Accès : `kubectl -n tekton-pipelines port-forward svc/tekton-dashboard 9097:9097` puis `http://localhost:9097` (ou Ingress protégé par [[18-oauth2-proxy-dex/01-oauth2-proxy|OAuth2 Proxy]]). Menus : **PipelineRuns**, **TaskRuns**, Pipelines, Tasks, EventListeners, Triggers ; journaux des steps en direct, bouton *Create* pour lancer un run. Installer la variante *read-only* si l'accès n'est pas filtré.

<!-- CAPTURE: Tekton Dashboard — PipelineRun et journaux des étapes | _assets/tekton-dashboard.png -->

## Argo Workflows (`https://<hôte>:2746`)

| Menu | Contenu |
| --- | --- |
| **Workflows** | Liste, état, **graphe** des étapes, journaux, artefacts, relancer, arrêter |
| Workflow Templates / Cluster Workflow Templates | Modèles réutilisables, soumission avec paramètres |
| **Cron Workflows** | Planifications, suspension |
| Event Flow / Sources / Sensors | Intégration Argo Events |
| Archived Workflows | Historique (avec la base d'archivage activée) |

<!-- CAPTURE: Argo Workflows — graphe DAG d'un workflow | _assets/argo-workflows-dag.png -->
<!-- CAPTURE: Argo Workflows — liste des Cron Workflows | _assets/argo-workflows-cron.png -->

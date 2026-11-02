---
title: Argo Workflows
description: Argo Workflows (CNCF, Apache 2.0) — moteur de workflows natif Kubernetes (étapes et DAG de conteneurs) pour CI, traitements par lots, ETL et apprentissage automatique : installation (manifeste de démarrage rapide ou Helm), argo-server et interface web (port 2746), modes d'authentification, CLI argo (submit, list, get, logs, watch, retry, cron), WorkflowTemplate, CronWorkflow, paramètres et artefacts (S3, MinIO), contrôle de concurrence, différences avec Argo CD et Argo Events.
tags: [argo workflows, kubernetes, workflows, dag, ci, batch, argo]
icon: info
---

**Argo Workflows** exécute des **workflows** dont chaque étape est un conteneur : suites séquentielles (`steps`) ou graphes de dépendances (**DAG**), avec paramètres, artefacts, boucles et reprises. À ne pas confondre avec **Argo CD** (déploiement GitOps) ni **Argo Events** (déclencheurs d'événements), qui le complètent.

## Installation

```bash
kubectl create namespace argo
kubectl apply -n argo -f https://github.com/argoproj/argo-workflows/releases/download/v3.6.2/quick-start-minimal.yaml   # démonstration
# Production : install.yaml de la version voulue, ou Helm
helm repo add argo https://argoproj.github.io/argo-helm && helm install argo-workflows argo/argo-workflows -n argo
kubectl -n argo port-forward svc/argo-server 2746:2746          # interface https://localhost:2746
```

CLI : archive de la page des versions GitHub (`argo-linux-amd64.gz`, `argo-darwin-*`, `argo-windows-amd64.exe.gz`) ou `brew install argo`.

## Workflow (DAG)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata: { generateName: sauvegarde-configs- }
spec:
  entrypoint: principal
  arguments:
    parameters: [{ name: site, value: paris }]
  templates:
    - name: principal
      dag:
        tasks:
          - { name: collecter, template: collecte }
          - { name: archiver, template: archive, dependencies: [collecter] }
    - name: collecte
      container:
        image: registry.corp.exemple.fr/outils/collecteur:1.4
        args: ["--site", "{{workflow.parameters.site}}"]
    - name: archive
      container:
        image: amazon/aws-cli:2.17.0
        command: [sh, -c]
        args: ["aws s3 cp /tmp/configs s3://configs/{{workflow.parameters.site}}/ --recursive --endpoint-url https://minio.corp.exemple.fr"]
```

```bash
argo submit -n argo sauvegarde.yaml -p site=lyon --watch
argo list -n argo ; argo logs -n argo @latest ; argo retry -n argo @latest
argo template create -n argo modele.yaml ; argo cron create -n argo sauvegarde-cron.yaml ; argo cron list -n argo
```

Authentification de l'interface : `--auth-mode=sso` (OIDC, par exemple [[05-keycloak/01-presentation-installation|Keycloak]] ou [[18-oauth2-proxy-dex/02-dex|Dex]]) ou jetons de compte de service (`client`). Le mode `server` (sans authentification) est réservé aux démonstrations.

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].

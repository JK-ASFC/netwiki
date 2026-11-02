---
title: Tekton
description: Tekton (CD Foundation, Apache 2.0) — briques de pipelines CI/CD natives Kubernetes : CRD Task, TaskRun, Pipeline, PipelineRun, workspaces et paramètres, installation de Tekton Pipelines, Triggers et Dashboard par manifestes ou opérateur, Tekton Hub et résolveurs (git, bundles), CLI tkn, exemple de pipeline (clonage Git, construction d'image avec Kaniko ou Buildah), Tekton Chains (signature et provenance), et usage dans OpenShift Pipelines.
tags: [tekton, kubernetes, ci, cd, pipelines, tkn, openshift]
icon: info
---

**Tekton** ne fournit pas une CI clé en main mais des **ressources Kubernetes** pour en construire une : chaque **Task** est un pod dont les **steps** sont des conteneurs ; une **Pipeline** enchaîne des Tasks qui partagent des **workspaces** (volumes). C'est la base d'**OpenShift Pipelines** et de plusieurs plates-formes internes.

## Installation

```bash
kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
kubectl apply -f https://storage.googleapis.com/tekton-releases/triggers/latest/release.yaml
kubectl apply -f https://storage.googleapis.com/tekton-releases/triggers/latest/interceptors.yaml
kubectl apply -f https://storage.googleapis.com/tekton-releases/dashboard/latest/release.yaml
kubectl get pods -n tekton-pipelines
```

Production : figer une version (`…/previous/vX.Y.Z/release.yaml`) ou utiliser l'**opérateur Tekton**. CLI **tkn** : `brew install tektoncd-cli`, `winget install tektoncd.cli` ou archive GitHub.

## Task et Pipeline

```yaml
apiVersion: tekton.dev/v1
kind: Task
metadata: { name: lint-ansible }
spec:
  workspaces: [{ name: source }]
  steps:
    - name: lint
      image: cytopia/ansible-lint
      workingDir: $(workspaces.source.path)
      script: ansible-lint
---
apiVersion: tekton.dev/v1
kind: Pipeline
metadata: { name: outils }
spec:
  params: [{ name: depot, type: string }]
  workspaces: [{ name: partage }]
  tasks:
    - name: cloner
      taskRef:
        resolver: hub
        params:
          - { name: name, value: git-clone }
          - { name: version, value: "0.9" }
      params: [{ name: url, value: $(params.depot) }]
      workspaces: [{ name: output, workspace: partage }]
    - name: lint
      runAfter: [cloner]
      taskRef: { name: lint-ansible }
      workspaces: [{ name: source, workspace: partage }]
```

```bash
kubectl apply -f lint-ansible.yaml -f pipeline-outils.yaml
tkn pipeline start outils -p depot=https://git.corp.exemple.fr/infra/outils.git \
  -w name=partage,volumeClaimTemplateFile=pvc.yaml --showlog
tkn pipelinerun list ; tkn pipelinerun logs -f --last
```

**Triggers** (EventListener, TriggerBinding, TriggerTemplate) créent des PipelineRun à partir des webhooks de la forge. **Chains** signe les images et produit des attestations SLSA.

Suite : [[02-argo-workflows|Argo Workflows]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].

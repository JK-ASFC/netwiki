---
title: Helm
description: Helm 3 (CNCF) — gestionnaire de paquets de Kubernetes : installation (script, winget, Homebrew, paquets), concepts (chart, release, valeurs, dépôts HTTP et registres OCI), installer et mettre à jour une application (upgrade --install, -f valeurs, --set, --atomic, --wait), historique et retour arrière, créer un chart (helm create, templates, _helpers.tpl, values.yaml, Chart.yaml, dépendances), tester et valider (lint, template, --dry-run, helm test), publier dans un registre OCI (Harbor), signer, Helmfile et bonnes pratiques de sécurité.
tags: [helm, kubernetes, charts, oci, déploiement, helmfile]
icon: info
---

**Helm** installe des applications Kubernetes à partir de **charts** (modèles de manifestes paramétrés par des **valeurs**) et suit chaque installation (**release**) avec son historique. Les bases sont présentées dans la fiche [[04-kubernetes/03-charges-de-travail|Kubernetes]] ; cette fiche approfondit l'usage en production et la création de charts.

## Installation

| Système | Commande |
| --- | --- |
| Linux, macOS | `curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 \| bash` |
| Windows | `winget install Helm.Helm` |
| macOS | `brew install helm` |
| Debian/Ubuntu | Dépôt Helm (Buildkite) ou snap `helm --classic` |

## Déployer et maintenir

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update
helm search repo postgresql --versions | head
helm show values bitnami/postgresql > valeurs-postgresql.yaml          # partir des valeurs par défaut
helm upgrade --install base bitnami/postgresql -n donnees --create-namespace \
  -f valeurs-postgresql.yaml --version 16.4.0 --atomic --wait --timeout 10m
helm list -n donnees ; helm status base -n donnees ; helm get values base -n donnees
helm history base -n donnees ; helm rollback base 3 -n donnees
helm diff upgrade base bitnami/postgresql -f valeurs-postgresql.yaml -n donnees    # greffon helm-diff
```

Registres **OCI** (Harbor, GHCR, registre GitLab) : `helm install app oci://registry.corp.exemple.fr/charts/app --version 1.4.0`.

## Créer un chart

```bash
helm create inventaire && tree inventaire        # Chart.yaml, values.yaml, templates/, templates/_helpers.tpl
helm lint inventaire
helm template inventaire ./inventaire -f valeurs-prod.yaml | less    # rendu local
helm install inventaire ./inventaire --dry-run --debug
helm package inventaire && helm push inventaire-0.1.0.tgz oci://registry.corp.exemple.fr/charts
```

```yaml
# templates/deployment.yaml (extrait)
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          resources: {{- toYaml .Values.resources | nindent 12 }}
```

## Bonnes pratiques

- Versionner les **fichiers de valeurs** par environnement dans Git, épingler `--version` des charts.
- Déploiement continu : [[30-gitops-argocd-flux/01-argo-cd|Argo CD]] ou [[30-gitops-argocd-flux/02-flux|Flux]] plutôt que des `helm upgrade` manuels ; **Helmfile** pour décrire un ensemble de releases.
- Ne pas mettre de secrets en clair dans les valeurs (SOPS, External Secrets).
- Relire les charts tiers (`helm template`) : ils peuvent créer des droits RBAC étendus.

Suite : [[02-kustomize|Kustomize]] · [[90-aide-memoire|aide-mémoire]].

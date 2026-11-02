---
title: Kustomize
description: Kustomize — personnalisation déclarative de manifestes Kubernetes sans modèles, intégrée à kubectl (kubectl apply -k) : base et overlays par environnement, kustomization.yaml (resources, namespace, namePrefix, labels, images, replicas, patches stratégiques et JSON 6902, configMapGenerator et secretGenerator, components), rendu (kustomize build, kubectl kustomize), intégration de charts Helm (helmCharts), et utilisation avec Argo CD et Flux.
tags: [kustomize, kubernetes, overlays, patches, gitops, kubectl]
icon: info
---

**Kustomize** part de manifestes YAML ordinaires (la **base**) et leur applique des **surcouches** (*overlays*) par environnement : changement d'image, de nombre de réplicas, d'étiquettes ou correctifs ciblés. Aucun langage de modèle : ce que l'on lit est ce qui est déployé. Il est intégré à `kubectl` (`-k`) et à [[30-gitops-argocd-flux/01-argo-cd|Argo CD]] et Flux.

```text
inventaire/
├── base/
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   └── service.yaml
└── overlays/
    ├── recette/kustomization.yaml
    └── prod/
        ├── kustomization.yaml
        └── ressources.yaml
```

```yaml
# base/kustomization.yaml
resources: [deployment.yaml, service.yaml]
labels:
  - pairs: { app.kubernetes.io/name: inventaire }
    includeSelectors: true
```

```yaml
# overlays/prod/kustomization.yaml
namespace: inventaire-prod
resources: [../../base]
images:
  - name: registry.corp.exemple.fr/infra/inventaire
    newTag: "1.8.2"
replicas:
  - name: inventaire
    count: 3
patches:
  - path: ressources.yaml                      # patch stratégique (même nom de ressource)
  - target: { kind: Deployment, name: inventaire }
    patch: |-
      - op: add
        path: /spec/template/spec/containers/0/env/-
        value: { name: NIVEAU_JOURNAL, value: "warning" }
configMapGenerator:
  - name: inventaire-config
    literals: [SITE=paris]
```

```bash
kubectl kustomize overlays/prod | less        # ou : kustomize build overlays/prod
kubectl diff -k overlays/prod
kubectl apply -k overlays/prod
```

Les ConfigMap générées portent un suffixe de hachage : toute modification de contenu redéclenche le déploiement des pods qui les utilisent. Intégrer un chart Helm : bloc `helmCharts` + `kustomize build --enable-helm`.

Commandes : [[90-aide-memoire|aide-mémoire]].

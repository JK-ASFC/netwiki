---
title: Helm et Kustomize — aide-mémoire des commandes
description: Commandes Helm (repo add/update/list/remove, search repo/hub, show values/chart/readme, install, upgrade --install, uninstall, list -A, status, history, rollback, get values/manifest/notes, template, lint, package, push, pull, registry login, dependency update, plugin install, test) et Kustomize (build, kubectl kustomize, apply -k, diff -k, delete -k, edit set image, create) avec exemples.
tags: [aide-mémoire, helm, kustomize]
icon: terminal
---

Explications : [[01-helm|Helm]] · [[02-kustomize|Kustomize]].

## Helm

```bash
helm repo add NOM URL ; helm repo update ; helm repo list ; helm search repo nginx ; helm search hub grafana
helm show values REPO/CHART ; helm show chart REPO/CHART ; helm pull REPO/CHART --untar --version X
helm upgrade --install REL REPO/CHART -n NS --create-namespace -f valeurs.yaml --set image.tag=1.2 --atomic --wait
helm list -A ; helm status REL -n NS ; helm history REL -n NS ; helm rollback REL 2 -n NS ; helm uninstall REL -n NS
helm get values REL -n NS ; helm get manifest REL -n NS | less ; helm get notes REL -n NS
helm template REL ./chart -f v.yaml ; helm lint ./chart ; helm dependency update ./chart ; helm test REL -n NS
helm registry login registry.corp.exemple.fr ; helm package ./chart ; helm push chart-0.1.0.tgz oci://registry.corp.exemple.fr/charts
helm plugin install https://github.com/databus23/helm-diff ; helm diff upgrade REL REPO/CHART -f v.yaml -n NS
```

## Kustomize

```bash
kubectl kustomize overlays/prod ; kustomize build overlays/prod ; kubectl diff -k overlays/prod ; kubectl apply -k overlays/prod ; kubectl delete -k overlays/recette
cd overlays/prod && kustomize edit set image registry.corp.exemple.fr/infra/inventaire:1.8.3 && kustomize edit add resource quota.yaml
kustomize create --autodetect
```

---
title: Argo CD et Flux — aide-mémoire des commandes
description: Commandes argocd (login, context, account, repo add/list, cluster add/list, proj, app create/list/get/diff/sync/history/rollback/delete/set/wait, appset) et flux (check, bootstrap, install, get all/sources/kustomizations/helmreleases, reconcile, suspend, resume, logs, create source git/kustomization/helmrelease --export, tree, diff, uninstall) avec exemples.
tags: [aide-mémoire, argo cd, argocd, flux]
icon: terminal
---

Explications : [[01-argo-cd|Argo CD]] · [[02-flux|Flux]].

## Argo CD

```bash
argocd login argocd.corp.exemple.fr --sso ; argocd context ; argocd account get-user-info
argocd repo add URL --username U --password P ; argocd repo list ; argocd cluster add contexte-prod ; argocd cluster list ; argocd proj list
argocd app create inv --repo URL --path inventaire/overlays/prod --dest-server https://kubernetes.default.svc --dest-namespace inv --sync-policy automated
argocd app list ; argocd app get inv ; argocd app diff inv ; argocd app sync inv --prune ; argocd app wait inv --health
argocd app history inv ; argocd app rollback inv 12 ; argocd app set inv --revision v1.8.2 ; argocd app delete inv --cascade
argocd appset list
```

## Flux

```bash
flux check ; flux version ; flux get all -A ; flux get sources git -A ; flux get kustomizations -A ; flux get helmreleases -A
flux reconcile source git deploiements ; flux reconcile kustomization inventaire --with-source ; flux reconcile helmrelease app -n ns
flux suspend kustomization inventaire ; flux resume kustomization inventaire ; flux logs --kind=Kustomization --name=inventaire
flux create source git app --url=URL --branch=main --export > source.yaml ; flux create kustomization app --source=app --path=./deploy --prune=true --export
flux tree kustomization flux-system ; flux diff kustomization inventaire --path ./inventaire/overlays/prod ; flux uninstall
```

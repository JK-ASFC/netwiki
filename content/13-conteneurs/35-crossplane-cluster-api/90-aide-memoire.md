---
title: Crossplane et Cluster API — aide-mémoire des commandes
description: Commandes Crossplane (kubectl get providers, managed, composite, claim, xrd, compositions ; crossplane beta trace ; journaux) et clusterctl (init, upgrade plan/apply, generate cluster, describe, get kubeconfig, move, delete) avec exemples.
tags: [aide-mémoire, crossplane, cluster api, clusterctl]
icon: terminal
---

Explications : [[01-presentation-installation|Crossplane et Cluster API]].

```bash
kubectl get providers ; kubectl get providerrevisions ; kubectl get managed ; kubectl get composite ; kubectl get claim -A ; kubectl get xrd ; kubectl get compositions
crossplane beta trace basededonnees.plateforme.corp.exemple.fr/inventaire -n equipe-a ; kubectl -n crossplane-system logs deploy/crossplane --tail=50
clusterctl init --infrastructure proxmox ; clusterctl upgrade plan ; clusterctl upgrade apply --contract v1beta1
clusterctl generate cluster c1 --kubernetes-version v1.32.3 > c1.yaml ; clusterctl describe cluster c1 --show-conditions all
clusterctl get kubeconfig c1 > c1.kubeconfig ; kubectl get clusters,machines,machinedeployments -A ; kubectl delete cluster c1
```

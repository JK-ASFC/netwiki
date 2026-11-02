---
title: OKD et OpenShift — aide-mémoire des commandes oc
description: Commandes oc avec exemples — login, whoami, projects, new-project, new-app, start-build, logs, expose, get route, rsh, debug node, adm top, adm policy add-role-to-user, add-scc-to-user, adm upgrade, adm must-gather, adm drain/cordon, get co, get clusterversion, get csr et approve, mirror ; openshift-install.
tags: [aide-mémoire, okd, openshift, oc]
icon: terminal
---

Explications : [[01-presentation-installation|OKD]].

```bash
oc login https://api.okd.corp.exemple.fr:6443 ; oc whoami ; oc whoami --show-console ; oc projects ; oc project inventaire
oc new-project app ; oc new-app --image=registry.corp.exemple.fr/app:1.2 ; oc start-build inventaire --follow ; oc logs -f deploy/inventaire
oc expose svc/inventaire --hostname=inventaire.apps.okd.corp.exemple.fr ; oc get route ; oc rsh deploy/inventaire
oc get co ; oc get clusterversion ; oc adm upgrade ; oc get nodes ; oc adm top nodes ; oc debug node/worker-1
oc adm cordon worker-1 ; oc adm drain worker-1 --ignore-daemonsets --delete-emptydir-data ; oc adm uncordon worker-1
oc get csr ; oc adm certificate approve <csr> ; oc adm policy add-role-to-user admin jk -n inventaire ; oc adm policy add-scc-to-user anyuid -z sa-app
oc adm must-gather --dest-dir=./diag
openshift-install version ; openshift-install agent wait-for bootstrap-complete --dir okd-prod
```

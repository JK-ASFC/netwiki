---
title: Velero et Kanister — aide-mémoire des commandes
description: Commandes Velero (install, backup create/get/describe/logs/delete, schedule create/get/pause, restore create/get/describe/logs, backup-location get/create, snapshot-location, repo get, plugin add, uninstall) et Kanister (kanctl create actionset/profile, kubectl get actionsets, blueprints) avec exemples.
tags: [aide-mémoire, velero, kanister]
icon: terminal
---

Explications : [[01-presentation-installation|Velero et Kanister]].

```bash
velero version ; velero backup-location get ; velero snapshot-location get ; velero repo get ; velero plugin get
velero backup create b1 --include-namespaces ns1,ns2 --exclude-resources secrets --wait ; velero backup get ; velero backup describe b1 --details ; velero backup logs b1
velero backup delete b1 --confirm ; velero schedule create s1 --schedule "@daily" --ttl 168h ; velero schedule get ; velero schedule pause s1
velero restore create r1 --from-backup b1 --include-resources deployments,configmaps ; velero restore get ; velero restore describe r1 ; velero restore logs r1
velero backup create b2 --from-schedule s1
kanctl create profile s3compliant --bucket kanister --endpoint https://minio.corp.exemple.fr --access-key A --secret-key S --region us-east-1 -n ns1
kubectl get blueprints,actionsets -n kanister ; kubectl describe actionset <nom> -n kanister
```

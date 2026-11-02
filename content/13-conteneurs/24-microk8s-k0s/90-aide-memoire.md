---
title: MicroK8s et k0s — aide-mémoire des commandes
description: Commandes MicroK8s (status, enable/disable, add-node, join, leave, remove-node, config, inspect, kubectl, ctr, start/stop, refresh) et k0s (install, start, stop, status, kubectl, token create/list/invalidate, backup, restore, reset, sysinfo ; k0sctl apply, kubeconfig, backup, reset) avec exemples.
tags: [aide-mémoire, microk8s, k0s, k0sctl]
icon: terminal
---

Explications : [[01-microk8s|MicroK8s]] · [[02-k0s|k0s]].

```bash
microk8s status ; microk8s enable dns ; microk8s disable ingress ; microk8s add-node ; microk8s leave ; microk8s remove-node noeud3
microk8s config > ~/.kube/config ; microk8s inspect ; microk8s ctr images ls ; microk8s stop ; microk8s start ; sudo snap refresh microk8s --channel=1.33/stable
sudo k0s status ; sudo k0s kubectl get pods -A ; sudo k0s token create --role=controller --expiry=1h ; sudo k0s token list ; sudo k0s sysinfo
sudo k0s backup --save-path /sauv/ ; sudo k0s restore /sauv/k0s_backup_*.tar.gz ; sudo k0s stop ; sudo k0s reset
k0sctl apply -c k0sctl.yaml ; k0sctl kubeconfig -c k0sctl.yaml ; k0sctl backup -c k0sctl.yaml ; k0sctl reset -c k0sctl.yaml
```

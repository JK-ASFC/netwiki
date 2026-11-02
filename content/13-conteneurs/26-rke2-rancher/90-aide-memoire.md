---
title: RKE2 et Rancher — aide-mémoire des commandes
description: Commandes RKE2 (systemctl rke2-server/agent, journaux, rke2 etcd-snapshot save/list/delete/prune, cluster-reset, certificate rotate, killall et uninstall, crictl, kubectl) et Rancher (helm upgrade, rollout, logs, réinitialisation du mot de passe admin, CLI rancher) avec exemples.
tags: [aide-mémoire, rke2, rancher]
icon: terminal
---

Explications : [[01-rke2|RKE2]] · [[02-rancher|Rancher]].

```bash
sudo systemctl status rke2-server ; sudo journalctl -u rke2-server -f ; sudo systemctl restart rke2-agent
sudo rke2 etcd-snapshot save --name manuel ; sudo rke2 etcd-snapshot list ; sudo rke2 etcd-snapshot prune --snapshot-retention 10
sudo rke2 certificate rotate ; sudo /usr/local/bin/rke2-killall.sh ; sudo /usr/local/bin/rke2-uninstall.sh
export CRI_CONFIG_FILE=/var/lib/rancher/rke2/agent/etc/crictl.yaml ; /var/lib/rancher/rke2/bin/crictl ps
helm upgrade rancher rancher-stable/rancher -n cattle-system --reuse-values --version <version> ; kubectl -n cattle-system rollout status deploy/rancher
kubectl -n cattle-system logs -l app=rancher --tail=50
kubectl -n cattle-system exec $(kubectl -n cattle-system get pods -l app=rancher -o name | head -1) -- reset-password
```

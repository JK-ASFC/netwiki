---
title: Talos Linux — aide-mémoire des commandes
description: Commandes talosctl avec exemples — gen config, apply-config (--insecure, --mode), patch machineconfig, bootstrap, kubeconfig, config endpoint/node/merge, dashboard, version, health, get members/disks/addresses/routes, services, logs, dmesg, read, list, upgrade, upgrade-k8s, reboot, shutdown, reset, etcd members/snapshot/remove-member, image ls.
tags: [aide-mémoire, talos linux, talosctl]
icon: terminal
---

Explications : [[01-presentation-installation|Talos Linux]].

```bash
talosctl gen config prod https://vip:6443 --config-patch @patch.yaml ; talosctl apply-config -n 10.0.20.71 -f worker.yaml --mode=no-reboot
talosctl -n 10.0.20.71 patch machineconfig --patch @nouveau-dns.yaml
talosctl config endpoint 10.0.20.61 ; talosctl config node 10.0.20.71 ; talosctl config merge ./talosconfig
talosctl version ; talosctl health ; talosctl dashboard ; talosctl get members ; talosctl -n N get disks ; talosctl -n N get addresses ; talosctl -n N get routes
talosctl -n N services ; talosctl -n N logs kubelet -f ; talosctl -n N dmesg -f ; talosctl -n N read /proc/meminfo ; talosctl -n N list /var/log
talosctl -n N upgrade --image <installeur> ; talosctl -n N upgrade-k8s --to <version> ; talosctl -n N reboot ; talosctl -n N shutdown ; talosctl -n N reset --graceful
talosctl -n 10.0.20.61 etcd members ; talosctl -n 10.0.20.61 etcd snapshot etcd.db ; talosctl -n 10.0.20.61 etcd remove-member <id>
talosctl -n N image ls
```

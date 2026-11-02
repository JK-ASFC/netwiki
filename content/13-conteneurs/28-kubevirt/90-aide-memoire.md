---
title: KubeVirt — aide-mémoire des commandes
description: Commandes KubeVirt avec exemples — kubectl get vm, vmi, dv, vmim ; virtctl start, stop, restart, pause, unpause, console, vnc, ssh, scp, migrate, image-upload, expose, addvolume, guestosinfo ; état de l'opérateur et des composants.
tags: [aide-mémoire, kubevirt, virtctl]
icon: terminal
---

Explications : [[01-presentation-installation|KubeVirt]].

```bash
kubectl -n kubevirt get kv ; kubectl get vm,vmi -A ; kubectl get dv -A ; kubectl get vmim -A
virtctl start vm1 ; virtctl stop vm1 ; virtctl restart vm1 ; virtctl pause vm vm1 ; virtctl unpause vm vm1
virtctl console vm1 ; virtctl vnc vm1 ; virtctl ssh admin@vm/vm1 ; virtctl scp fichier admin@vm/vm1:/tmp/
virtctl migrate vm1 ; virtctl guestosinfo vm1 ; virtctl expose vm vm1 --name vm1-ssh --port 22 --type NodePort
virtctl image-upload dv disque-win --size=60Gi --image-path=./windows.qcow2 --uploadproxy-url=https://cdi-upload.corp.exemple.fr
```

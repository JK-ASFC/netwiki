---
title: Rook, Longhorn et OpenEBS — aide-mémoire des commandes
description: Commandes kubectl pour le stockage Kubernetes (get sc, pv, pvc, volumeattachments, csidrivers), Rook (cephcluster, toolbox ceph status, osd tree, pod logs de l'opérateur), Longhorn (volumes.longhorn.io, nodes, backups, engines, replicas) et OpenEBS (pods, sc, lvmvolumes, diskpool) avec exemples.
tags: [aide-mémoire, rook, longhorn, openebs, kubectl]
icon: terminal
---

Explications : [[01-rook|Rook]] · [[02-longhorn-openebs|Longhorn et OpenEBS]].

```bash
kubectl get sc ; kubectl get pv ; kubectl get pvc -A ; kubectl get volumeattachments ; kubectl get csidrivers
kubectl -n rook-ceph get cephcluster,cephblockpool,cephfilesystem,cephobjectstore
kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- ceph status ; kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- ceph osd tree
kubectl -n rook-ceph logs deploy/rook-ceph-operator --tail=50
kubectl -n longhorn-system get volumes.longhorn.io ; kubectl -n longhorn-system get nodes.longhorn.io ; kubectl -n longhorn-system get backups.longhorn.io
kubectl -n longhorn-system get replicas.longhorn.io -o wide | head
kubectl -n openebs get pods ; kubectl get lvmvolumes -A ; kubectl get diskpool -n openebs
```

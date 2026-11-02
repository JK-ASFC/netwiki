---
title: Rook (Ceph sur Kubernetes)
description: Rook — opérateur CNCF qui déploie et gère Ceph dans Kubernetes : architecture (opérateur, CRD CephCluster, CephBlockPool, CephFilesystem, CephObjectStore), prérequis (nœuds avec disques bruts, lvm2, noyau RBD), installation par manifestes ou Helm, cluster.yaml, StorageClass RBD et CephFS (CSI), stockage objet et ObjectBucketClaim, boîte à outils (toolbox) et commandes ceph, tableau de bord, mises à jour et sauvegarde.
tags: [rook, ceph, kubernetes, csi, opérateur, stockage persistant]
icon: info
---

**Rook** installe [[24-ceph/01-presentation-installation|Ceph]] **dans** un cluster [[04-kubernetes/01-presentation-architecture|Kubernetes]] et fournit des volumes persistants (bloc RBD, fichiers CephFS partagés en `ReadWriteMany`, objet S3) via les pilotes **CSI**. Idéal pour un cluster sur site sans baie de stockage.

## Installation

```bash
helm repo add rook-release https://charts.rook.io/release
helm install --create-namespace -n rook-ceph rook-ceph rook-release/rook-ceph
# Cluster Ceph : partir de l'exemple cluster.yaml du dépôt Rook (version correspondante)
kubectl apply -f cluster.yaml          # spec.storage.useAllNodes / useAllDevices ou liste de nœuds et disques
kubectl -n rook-ceph get cephcluster ; kubectl -n rook-ceph get pods
```

Prérequis : au moins 3 nœuds avec des **disques bruts** sans partition ni système de fichiers, paquet `lvm2`, module noyau `rbd`.

```yaml
# Pool bloc et StorageClass
apiVersion: ceph.rook.io/v1
kind: CephBlockPool
metadata: { name: replipool, namespace: rook-ceph }
spec: { failureDomain: host, replicated: { size: 3 } }
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata: { name: ceph-bloc, annotations: { storageclass.kubernetes.io/is-default-class: "true" } }
provisioner: rook-ceph.rbd.csi.ceph.com
parameters:
  clusterID: rook-ceph
  pool: replipool
  csi.storage.k8s.io/provisioner-secret-name: rook-csi-rbd-provisioner
  csi.storage.k8s.io/provisioner-secret-namespace: rook-ceph
  csi.storage.k8s.io/node-stage-secret-name: rook-csi-rbd-node
  csi.storage.k8s.io/node-stage-secret-namespace: rook-ceph
  csi.storage.k8s.io/fstype: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
```

```bash
kubectl apply -f toolbox.yaml && kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- ceph -s
kubectl -n rook-ceph get secret rook-ceph-dashboard-password -o jsonpath='{.data.password}' | base64 -d   # tableau de bord
```

Suite : [[02-longhorn-openebs|Longhorn et OpenEBS]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].

---
title: Longhorn et OpenEBS
description: Longhorn (SUSE/CNCF) et OpenEBS (CNCF) — stockage bloc pour Kubernetes : Longhorn (volumes répliqués sur les disques des nœuds, interface web, instantanés, sauvegardes vers S3 ou NFS, reconstruction, mises à jour), prérequis (open-iscsi, NFS client), installation Helm, StorageClass, volumes RWX ; OpenEBS (moteurs Local PV hostpath, LVM et ZFS, Mayastor/Replicated PV en NVMe-oF), choix selon les besoins et comparaison avec Rook.
tags: [longhorn, openebs, kubernetes, stockage bloc, csi, sauvegarde, mayastor]
icon: info
---

## Longhorn

**Longhorn** crée des volumes bloc **répliqués** (3 copies par défaut) sur les disques locaux des nœuds, avec une **interface web**, des instantanés et des **sauvegardes** vers S3 ou NFS. Simple à installer, il convient très bien à [[05-k3s/01-presentation-installation|K3s]] et aux clusters petits et moyens.

```bash
# Prérequis sur chaque nœud
sudo apt install open-iscsi nfs-common && sudo systemctl enable --now iscsid      # RHEL : iscsi-initiator-utils nfs-utils
helm repo add longhorn https://charts.longhorn.io && helm repo update
helm install longhorn longhorn/longhorn --namespace longhorn-system --create-namespace \
  --set defaultSettings.backupTarget=s3://sauv-longhorn@us-east-1/ --set defaultSettings.backupTargetCredentialSecret=longhorn-s3
kubectl -n longhorn-system get pods
```

StorageClass `longhorn` créée automatiquement ; volumes `ReadWriteMany` servis par un partage NFS interne. Planifier les sauvegardes avec des **RecurringJob** (quotidien, rétention 14).

## OpenEBS

**OpenEBS** regroupe plusieurs moteurs :

| Moteur | Principe | Usage |
| --- | --- | --- |
| **Local PV Hostpath** | Répertoire du nœud | Bases répliquées par l'application (Kafka, Cassandra) |
| Local PV LVM / ZFS | Volume LVM ou dataset ZFS du nœud | Idem, avec quotas, instantanés |
| **Replicated PV (Mayastor)** | Volumes répliqués NVMe-oF, hautes performances | Applications sans réplication propre |

```bash
helm repo add openebs https://openebs.github.io/openebs && helm repo update
helm install openebs openebs/openebs -n openebs --create-namespace     # options pour activer/désactiver chaque moteur
kubectl get sc                                                          # openebs-hostpath, openebs-single-replica…
```

Choix : **Longhorn** pour la simplicité et l'interface, **Rook/Ceph** pour un stockage unifié bloc/fichier/objet à grande échelle, **OpenEBS Local PV** pour des bases distribuées qui répliquent elles-mêmes.

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].

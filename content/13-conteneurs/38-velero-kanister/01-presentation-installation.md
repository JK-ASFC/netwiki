---
title: Présentation, installation et utilisation
description: Velero (VMware/Broadcom, Apache 2.0) et Kanister (Kasten/Veeam, CNCF) — sauvegarde de Kubernetes : ce qu'il faut sauvegarder (ressources, volumes, etcd), Velero (CLI, installation avec un stockage objet S3/MinIO, plugins AWS et CSI, BackupStorageLocation, sauvegardes et planifications, sauvegarde des volumes par instantanés CSI ou copie par Kopia (File System Backup), restauration et migration entre clusters, hooks), Kanister (Blueprints pour des sauvegardes cohérentes de bases de données, ActionSet, kanctl) et stratégie de restauration.
tags: [velero, kanister, kubernetes, sauvegarde, restauration, s3, csi]
icon: info
---

Sauvegarder un cluster, c'est protéger trois choses : l'**état du cluster** (etcd, par l'outil de la distribution), les **ressources** des applications (manifestes, de préférence déjà dans Git) et les **données** des volumes persistants. **Velero** couvre les ressources et les volumes ; **Kanister** ajoute la cohérence applicative (vidage d'une base avant copie).

## Velero

```bash
# CLI : binaire GitHub (Linux, macOS, Windows), brew install velero ou choco install velero
cat > identifiants-velero <<'EOF2'
[default]
aws_access_key_id = VELEROACCES
aws_secret_access_key = SecretVelero2026
EOF2
velero install --provider aws --plugins velero/velero-plugin-for-aws:v1.11.0 \
  --bucket velero-prod --secret-file ./identifiants-velero \
  --backup-location-config region=us-east-1,s3ForcePathStyle=true,s3Url=https://minio.corp.exemple.fr \
  --use-node-agent --features=EnableCSI
velero backup-location get
```

```bash
velero backup create avant-maj --include-namespaces inventaire-prod --wait
velero schedule create quotidien --schedule="0 2 * * *" --ttl 720h --default-volumes-to-fs-backup
velero backup get ; velero backup describe avant-maj --details ; velero backup logs avant-maj
velero restore create --from-backup avant-maj --namespace-mappings inventaire-prod:inventaire-test
velero restore get
```

Volumes : **instantanés CSI** (rapides, restent dans la baie ou Ceph — à exporter avec `--snapshot-move-data` pour qu'ils sortent du stockage) ou **sauvegarde de système de fichiers** par l'agent de nœud (Kopia). Les **hooks** (annotations `pre.hook.backup.velero.io/command`) figent une application avant la copie.

## Kanister

```bash
helm repo add kanister https://charts.kanister.io/ && helm install kanister kanister/kanister-operator -n kanister --create-namespace
kubectl apply -f blueprint-postgresql.yaml -n kanister          # actions backup/restore (pg_dump vers S3)
kanctl create actionset --action backup --namespace kanister --blueprint postgresql-bp --statefulset inventaire-prod/postgresql --profile inventaire-prod/profil-s3
kubectl -n kanister get actionsets
```

> [!TIP]
> Une sauvegarde n'est validée qu'après une **restauration réussie** : restaurez régulièrement dans un namespace ou un cluster de test (`--namespace-mappings`).

Commandes : [[90-aide-memoire|aide-mémoire]].

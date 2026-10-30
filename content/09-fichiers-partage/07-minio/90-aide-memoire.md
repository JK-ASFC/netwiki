---
title: MinIO — aide-mémoire des commandes
description: Commandes MinIO avec exemples — serveur (minio server, variables, mode distribué), client mc (alias, mb, ls, cp, mirror, rm, du, stat, share), versionnage et verrouillage d'objets, cycle de vie, réplication, utilisateurs, groupes et politiques (mc admin), comptes de service, chiffrement, supervision (mc admin info, trace, heal, prometheus), AWS CLI compatible S3.
tags: [aide-mémoire, minio, s3, mc, stockage objet, politiques]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|MinIO]].

## Serveur

```bash
export MINIO_ROOT_USER=admin-minio MINIO_ROOT_PASSWORD='MotDePasseTresLong2026'
minio server /srv/minio --console-address ":9001"
# Distribué : 4 nœuds × 4 disques
minio server https://minio{1...4}.exemple.fr/mnt/disque{1...4}/minio --console-address ":9001"
sudo systemctl status minio
```

## Client mc

```bash
mc alias set local https://minio.exemple.fr admin-minio 'MotDePasseTresLong2026'
mc admin info local
mc mb local/sauvegardes
mc ls local
mc cp rapport.pdf local/documents/2026/
mc cp --recursive ./site/ local/site-statique/
mc mirror --overwrite --remove /srv/donnees local/sauvegardes/donnees
mc mirror --watch /srv/depot local/depot                  # synchronisation continue
mc stat local/documents/2026/rapport.pdf
mc du local/sauvegardes
mc find local/documents --name "*.pdf" --older-than 30d
mc rm --recursive --force --older-than 90d local/temp/
mc share download --expire 24h local/documents/2026/rapport.pdf     # lien présigné
mc cat local/config/app.json | jq .
```

## Versionnage, verrouillage, cycle de vie

```bash
mc version enable local/documents
mc ls --versions local/documents/2026/
mc mb --with-lock local/archives                          # verrouillage d'objets (WORM)
mc retention set --default COMPLIANCE 365d local/archives
mc ilm rule add --expire-days 90 local/temp
mc ilm rule add --noncurrent-expire-days 30 local/documents
mc ilm rule ls local/documents
```

## Utilisateurs et politiques

```bash
mc admin user add local sauvegarde 'MotDePasseSauvegarde2026'
mc admin policy create local ecriture-sauvegardes ecriture-sauvegardes.json
mc admin policy attach local ecriture-sauvegardes --user sauvegarde
mc admin group add local equipe-reseau amartin bpetit
mc admin user svcacct add local sauvegarde               # clés d'accès pour une application
mc admin user ls local
mc anonymous set download local/site-statique            # lecture publique (prudence)
```

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
    "Resource": ["arn:aws:s3:::sauvegardes", "arn:aws:s3:::sauvegardes/*"]
  }]
}
```

## Réplication et chiffrement

```bash
mc replicate add local/documents --remote-bucket "https://user:secret@minio-dr.exemple.fr/documents"
mc replicate status local/documents
mc encrypt set sse-s3 local/documents
```

## Supervision et diagnostic

```bash
mc admin trace local --verbose --path "documents/*"
mc admin heal local --recursive
mc admin prometheus generate local
mc admin service restart local
```

## AWS CLI compatible

```bash
aws --endpoint-url https://minio.exemple.fr s3 ls s3://sauvegardes/
aws --endpoint-url https://minio.exemple.fr s3 sync ./export s3://sauvegardes/export/
```

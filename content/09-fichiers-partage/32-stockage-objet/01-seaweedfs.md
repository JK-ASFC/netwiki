---
title: SeaweedFS
description: SeaweedFS — stockage distribué de fichiers et d'objets (Apache 2.0) optimisé pour des milliards de petits fichiers : architecture (master, volume servers, filer, passerelle S3), installation (binaire weed unique sur Linux, macOS, Windows, Docker, Helm), démarrage tout-en-un ou séparé, réplication (codes 000 à 200), API S3 et identités, montage FUSE, WebDAV, réplication inter-sites, codage d'effacement, interface web et commandes weed shell.
tags: [seaweedfs, stockage objet, s3, petits fichiers, distribué]
icon: info
---

**SeaweedFS** stocke efficacement d'énormes quantités de **petits fichiers** (images, pièces jointes, journaux) : les métadonnées des volumes sont en mémoire, chaque lecture ne coûte qu'un accès disque. Il propose une **API S3**, un *filer* (arborescence de fichiers), FUSE et WebDAV — une alternative à [[07-minio/01-presentation-installation|MinIO]].

| Composant | Port | Rôle |
| --- | --- | --- |
| master | 9333 | Topologie, attribution des volumes |
| volume | 8080 | Stockage des données |
| filer | 8888 | Arborescence, métadonnées (LevelDB, PostgreSQL, Redis…) |
| s3 | 8333 | Passerelle S3 |

## Installation

```bash
# Binaire unique « weed » (versions GitHub) ou Docker
weed server -dir=/srv/seaweed -master.port=9333 -volume.port=8080 -filer -s3 -s3.config=/etc/seaweedfs/s3.json   # tout-en-un
docker run -d -p 9333:9333 -p 8080:8080 -p 8888:8888 -p 8333:8333 -v /srv/seaweed:/data chrislusf/seaweedfs server -dir=/data -filer -s3
```

En production : 3 masters (`-peers`), plusieurs volume servers avec `-dataCenter` et `-rack`, réplication par défaut `-defaultReplication=010` (une copie sur un autre rack).

```json
{
  "identities": [
    { "name": "sauvegardes", "credentials": [{ "accessKey": "SAUVACCES", "secretKey": "SecretSauv2026" }], "actions": ["Read", "Write", "List", "Tagging"] }
  ]
}
```

```bash
aws --endpoint-url http://seaweed1:8333 s3 mb s3://sauvegardes
weed mount -filer=seaweed1:8888 -dir=/mnt/seaweed          # FUSE
echo "volume.list" | weed shell -master=seaweed1:9333
```

Suite : [[02-garage|Garage]] · [[03-openstack-swift-openio|Swift et OpenIO]] · [[90-aide-memoire|aide-mémoire]].

---
title: Stockage objet — aide-mémoire des commandes
description: Commandes SeaweedFS (weed server, master, volume, filer, s3, mount, weed shell : volume.list, volume.balance, volume.fix.replication, fs.ls), Garage (status, node connect, layout assign/show/apply, bucket, key, stats, repair) et Swift (swift-ring-builder, swift-init, swift-recon, swift stat/list/upload/download/delete, swift-dispersion-report) avec exemples ; client S3 générique.
tags: [aide-mémoire, seaweedfs, garage, swift, s3]
icon: terminal
---

Explications : [[01-seaweedfs|SeaweedFS]] · [[02-garage|Garage]] · [[03-openstack-swift-openio|Swift et OpenIO]].

```bash
weed version ; weed master -mdir=/srv/m -peers=s1:9333,s2:9333,s3:9333 ; weed volume -dir=/srv/v -mserver=s1:9333 -dataCenter=paris -rack=r1
echo "volume.list" | weed shell -master=s1:9333 ; echo "lock; volume.balance -force; unlock" | weed shell ; echo "lock; volume.fix.replication; unlock" | weed shell
garage status ; garage layout show ; garage bucket list ; garage bucket info sauvegardes ; garage key list ; garage stats ; garage repair --yes tables
swift-ring-builder object.builder ; swift-init all status ; swift-recon --all ; swift-dispersion-report
swift stat ; swift list ; swift upload conteneur fichier ; swift download conteneur fichier ; swift delete conteneur fichier
aws --endpoint-url https://s3.corp.exemple.fr s3 ls ; rclone lsd garage: ; s3cmd --host=s3.corp.exemple.fr ls
```

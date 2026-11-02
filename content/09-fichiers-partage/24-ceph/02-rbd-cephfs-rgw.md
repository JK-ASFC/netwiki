---
title: Pools, RBD, CephFS, RGW et exploitation
description: Exploitation de Ceph — pools répliqués et à codage d'effacement, autoscaler de PG, règles CRUSH par classe de disque, RBD (création d'images, mappage, instantanés, clones, miroir), CephFS (volumes, montage noyau et FUSE, sous-volumes, quotas), RGW (déploiement, utilisateurs S3, buckets, compatibilité), clients et clés (ceph auth), maintenance (noout, remplacement de disque), santé, mises à jour avec cephadm et dépannage courant.
tags: [ceph, rbd, cephfs, rgw, s3, pools, maintenance]
icon: settings
---

## Pools

```bash
ceph osd pool create vm 128 && ceph osd pool application enable vm rbd && rbd pool init vm
ceph osd pool set vm size 3 ; ceph osd pool set vm min_size 2
ceph osd pool autoscale-status
ceph osd crush rule create-replicated ssd-uniquement default host ssd && ceph osd pool set vm crush_rule ssd-uniquement
ceph osd erasure-code-profile set ec-4-2 k=4 m=2 crush-failure-domain=host
ceph osd pool create archives erasure ec-4-2      # 1,5× d'espace brut au lieu de 3×
```

## RBD (bloc)

```bash
rbd create vm/disque-app01 --size 100G
ceph auth get-or-create client.app01 mon 'profile rbd' osd 'profile rbd pool=vm' > /etc/ceph/ceph.client.app01.keyring
sudo rbd map vm/disque-app01 --id app01 && sudo mkfs.xfs /dev/rbd0       # sur un client Linux (ceph-common)
rbd snap create vm/disque-app01@avant-maj ; rbd snap ls vm/disque-app01 ; rbd snap rollback vm/disque-app01@avant-maj
rbd du -p vm
```

## CephFS (fichiers)

```bash
ceph fs volume create partage                     # crée pools et MDS via l'orchestrateur
ceph fs authorize partage client.equipe-web /web rw > /etc/ceph/ceph.client.equipe-web.keyring
sudo mount -t ceph admin@.partage=/web /mnt/web -o name=equipe-web      # syntaxe des noyaux récents (mount.ceph)
setfattr -n ceph.quota.max_bytes -v 107374182400 /mnt/web                 # quota de 100 Gio
ceph fs subvolume create partage projets ; ceph fs status
```

## RGW (objet S3)

```bash
ceph orch apply rgw s3 --placement="2 ceph1 ceph2" --port=8080
radosgw-admin user create --uid=sauvegardes --display-name="Sauvegardes" > sauvegardes.json   # contient access_key et secret_key
radosgw-admin bucket list ; radosgw-admin bucket stats --bucket=veeam
aws --endpoint-url http://ceph1:8080 s3 mb s3://veeam
```

Publier RGW derrière [[01-haproxy/01-presentation|HAProxy]] avec TLS. Les logiciels de sauvegarde ([[05-veeam/01-presentation-architecture|Veeam]], [[01-restic/01-presentation-installation|restic]]) l'utilisent comme dépôt S3.

## Maintenance

```bash
ceph osd set noout                  # avant de redémarrer un nœud : pas de rééquilibrage
ceph orch host maintenance enter ceph2 ; ceph orch host maintenance exit ceph2
ceph osd unset noout
ceph orch osd rm 12 --replace       # remplacer un disque : vider l'OSD, garder son identifiant
ceph orch upgrade start --ceph-version 19.2.2 ; ceph orch upgrade status
ceph health detail ; ceph crash ls ; ceph crash archive-all
```

Commandes : [[90-aide-memoire|aide-mémoire]].

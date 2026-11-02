---
title: OpenStack Swift et OpenIO
description: OpenStack Swift — stockage objet distribué d'OpenStack (Apache 2.0) : architecture (proxy, account, container, object, anneaux, zones et régions), installation (paquets des distributions, SAIO pour tester, déploiement OpenStack), swift-ring-builder, authentification Keystone ou tempauth, API Swift et compatibilité S3 (s3api), client swift, réplication et audit ; et OpenIO (stockage objet S3 racheté par OVHcloud, projet open source arrêté) : état et migration.
tags: [openstack swift, openio, stockage objet, s3, openstack]
icon: info
---

## OpenStack Swift

**Swift** est le service de stockage objet d'OpenStack, aussi utilisable seul. Les données sont placées grâce à des **anneaux** (*rings*) qui tiennent compte des zones et régions, et répliquées (3 copies par défaut) ou codées par effacement.

| Service | Rôle |
| --- | --- |
| **proxy-server** | API (Swift et S3 via le middleware `s3api`), authentification |
| account / container / object | Stockage des listes et des objets |
| Réplicateurs, auditeurs | Réparation et vérification en arrière-plan |

```bash
sudo apt install swift swift-proxy swift-account swift-container swift-object python3-swiftclient   # Debian/Ubuntu ; RHEL via les dépôts RDO
cd /etc/swift
swift-ring-builder object.builder create 10 3 1                     # 2^10 partitions, 3 répliques
swift-ring-builder object.builder add r1z1-10.0.30.21:6200/sdb 100
swift-ring-builder object.builder add r1z2-10.0.30.22:6200/sdb 100
swift-ring-builder object.builder add r1z3-10.0.30.23:6200/sdb 100
swift-ring-builder object.builder rebalance                          # idem account.builder (6202) et container.builder (6201)
sudo swift-init all start
swift -A http://proxy:8080/auth/v1.0 -U test:tester -K testing stat   # tempauth (test)
swift upload sauvegardes ./archives/ ; swift list sauvegardes
```

Pour tester sur une seule machine : guide **SAIO** (*Swift All In One*). En production : authentification **Keystone**, `s3api` pour les clients S3, publication du proxy derrière un répartiteur TLS.

## OpenIO

**OpenIO** était un stockage objet S3 libre (Lille) racheté par **OVHcloud** en 2020 ; le développement open source a ensuite été arrêté et intégré aux offres d'OVHcloud. Les installations existantes ne reçoivent plus de mises à jour : migrer vers [[24-ceph/02-rbd-cephfs-rgw|Ceph RGW]], [[07-minio/01-presentation-installation|MinIO]], [[01-seaweedfs|SeaweedFS]] ou [[02-garage|Garage]] avec `rclone sync` (copie S3 vers S3).

Commandes : [[90-aide-memoire|aide-mémoire]].

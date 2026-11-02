---
title: Garage
description: Garage (Deuxfleurs, AGPL) — stockage objet compatible S3 léger, conçu pour la géo-distribution sur du matériel modeste et des liaisons Internet ordinaires : principes (zones, réplication 3 copies, pas de nœud central), installation (binaire statique, Docker, NixOS), garage.toml (rpc_secret, metadata_dir, data_dir, s3_api), mise en place de la disposition (layout assign, apply), clés et buckets, sites web statiques, administration et supervision.
tags: [garage, s3, stockage objet, géo-distribué, auto-hébergement]
icon: info
---

**Garage** réplique les objets sur des nœuds placés dans **plusieurs lieux** (maison, bureau, petit hébergeur) avec du matériel modeste : pas de besoin de réseau rapide ni de serveurs puissants. Idéal pour les associations, PME et l'auto-hébergement résilient, avec une API S3 suffisante pour les sauvegardes ([[01-restic/01-presentation-installation|restic]], [[09-kopia/01-presentation-installation|Kopia]]), Nextcloud ou des sites statiques.

## Installation

```bash
VERSION=v1.1.0      # version courante : https://garagehq.deuxfleurs.fr/download/
curl -L -o /usr/local/bin/garage "https://garagehq.deuxfleurs.fr/_releases/${VERSION}/x86_64-unknown-linux-musl/garage" && chmod +x /usr/local/bin/garage
```

```toml
# /etc/garage.toml
metadata_dir = "/var/lib/garage/meta"
data_dir = "/var/lib/garage/data"
db_engine = "lmdb"
replication_factor = 3
rpc_bind_addr = "[::]:3901"
rpc_public_addr = "garage-paris.corp.exemple.fr:3901"
rpc_secret = "<openssl rand -hex 32, identique sur tous les nœuds>"
[s3_api]
s3_region = "garage"
api_bind_addr = "[::]:3900"
root_domain = ".s3.corp.exemple.fr"
[admin]
api_bind_addr = "127.0.0.1:3903"
```

Docker : `dxflrs/garage`. Service systemd fourni dans la documentation.

```bash
garage status                                            # identifiants des nœuds
garage node connect <id>@garage-lyon.corp.exemple.fr:3901
garage layout assign -z paris -c 1T <id-noeud-paris>
garage layout assign -z lyon -c 1T <id-noeud-lyon>
garage layout assign -z bureau -c 500G <id-noeud-bureau>
garage layout show && garage layout apply --version 1
garage bucket create sauvegardes
garage key create cle-restic && garage bucket allow --read --write sauvegardes --key cle-restic
garage key info cle-restic --show-secret
```

Suite : [[03-openstack-swift-openio|Swift et OpenIO]] · [[90-aide-memoire|aide-mémoire]].

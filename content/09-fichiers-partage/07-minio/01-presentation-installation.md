---
title: Présentation, licence et installation
description: MinIO, stockage objet compatible S3 — notions (compartiments, objets, clés d'accès, effacement de code, ensembles de disques), évolution de l'édition communautaire (AGPL, console allégée, distribution en sources, alternatives Garage, SeaweedFS, Ceph RGW), installation mono-nœud multi-disques et distribuée sous Linux, conteneur, Windows et macOS, TLS, client mc et premiers compartiments.
tags: [minio, s3, stockage objet, effacement de code, mc, installation, tls, garage]
icon: info
---

**MinIO** est un serveur de **stockage objet** compatible avec l'API **Amazon S3**, écrit en Go : un binaire unique, très performant, qui sert de cible de sauvegarde (Veeam, restic, Velero), de stockage pour les applications (GitLab, Loki, Nextcloud), de backend d'état [[04-terraform/02-etat-modules-import|Terraform]] ou de lac de données.

> [!IMPORTANT]
> **Édition communautaire.** MinIO est sous **AGPL v3** (toute modification proposée en service réseau doit être publiée). En 2025, l'éditeur a retiré la plupart des fonctions d'administration de la console web communautaire, cessé de publier binaires et images pour la version communautaire (distribution en **sources**), puis l'a placée en mode **maintenance** ; l'offre activement développée est **AIStor** (commerciale). Pour un nouveau projet, évaluez aussi **Garage** (léger, géo-distribué), **SeaweedFS**, **Ceph RGW** (gros volumes) ou un stockage S3 d'appliance (NAS, baie) — les concepts et outils S3 de cette page restent valables.

## Notions

| Notion | Description |
| --- | --- |
| **Compartiment** (*bucket*) | Conteneur d'objets, nom unique (DNS-compatible) |
| **Objet** | Fichier + métadonnées, identifié par une **clé** (`sauvegardes/2026/10/srv01.tar`) |
| **Clés d'accès** | Paire *access key* / *secret key* (signature AWS v4) |
| **Effacement de code** (*erasure coding*) | Données et parités réparties sur les disques d'un **ensemble** (*erasure set*) : tolère la perte de disques ou de nœuds sans RAID |
| Pool de serveurs | Groupe de nœuds/disques ; extension par ajout de pools |
| Versionnage, verrouillage d'objets | Historique des versions ; **immutabilité** WORM (mode *compliance* / *governance*) |

Exemple : 4 nœuds × 4 disques = 16 disques, parité EC:4 par défaut → tolère la perte de 4 disques (ou d'un nœud entier) ; capacité utile ≈ 75 %.

## Prérequis

- Disques **dédiés**, formatés en **XFS**, montés par UUID (`/mnt/disque1`…) — pas de RAID matériel, pas de LVM
- Même nombre et même taille de disques sur chaque nœud ; noms d'hôtes séquentiels (`minio{1...4}.corp.exemple.fr`)
- Heure synchronisée, réseau 10 Gbit/s ou plus pour le distribué
- Ports : **9000** (API S3), **9001** (console)

## Installation sous Linux

```bash
# Binaire (compilé depuis les sources ou fourni par votre distribution / dépôt interne)
sudo install -m 0755 minio /usr/local/bin/minio
sudo useradd -r -s /sbin/nologin minio-user
sudo mkdir -p /mnt/disque{1..4} && sudo chown minio-user: /mnt/disque{1..4}
```

```ini /etc/default/minio
# Mono-nœud multi-disques
MINIO_VOLUMES="/mnt/disque{1...4}"
# Distribué (identique sur chaque nœud) :
# MINIO_VOLUMES="https://minio{1...4}.corp.exemple.fr:9000/mnt/disque{1...4}"
MINIO_OPTS="--console-address :9001"
MINIO_ROOT_USER=admin-minio
MINIO_ROOT_PASSWORD=MotDePasseRacineTresLong
MINIO_SERVER_URL=https://s3.corp.exemple.fr
MINIO_BROWSER_REDIRECT_URL=https://console-s3.corp.exemple.fr
```

```ini /etc/systemd/system/minio.service
[Unit]
Description=MinIO
Wants=network-online.target
After=network-online.target

[Service]
User=minio-user
Group=minio-user
EnvironmentFile=/etc/default/minio
ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES
Restart=always
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now minio
sudo firewall-cmd --permanent --add-port={9000,9001}/tcp && sudo firewall-cmd --reload
```

### TLS

Placez `public.crt` et `private.key` dans `~minio-user/.minio/certs/` (et l'AC interne dans `certs/CAs/`) : MinIO active HTTPS automatiquement. Le certificat doit couvrir tous les noms des nœuds et le nom d'accès (`s3.corp.exemple.fr`). Derrière un reverse proxy, transmettez l'en-tête `Host` sans modification (signatures S3).

### Conteneur, Windows, macOS

```bash
docker run -d --name minio -p 9000:9000 -p 9001:9001 \
  -v /srv/minio:/data -e MINIO_ROOT_USER=admin-minio -e MINIO_ROOT_PASSWORD=MotDePasseRacineTresLong \
  <image-minio-de-votre-registre> server /data --console-address ":9001"
```

Sous Windows (`minio.exe server D:\Donnees --console-address ":9001"`, service via NSSM ou WinSW) et macOS (`minio server ~/donnees`), réservez l'usage aux tests ou petits volumes : la production se fait sous Linux.

## Client mc

```bash
mc alias set corp https://s3.corp.exemple.fr admin-minio 'MotDePasseRacineTresLong'
mc admin info corp                       # état des nœuds et disques
mc mb corp/sauvegardes
mc mb --with-lock corp/sauvegardes-immuables      # verrouillage d'objets (à la création seulement)
mc version enable corp/sauvegardes
mc cp rapport.pdf corp/sauvegardes/rapports/
mc ls --recursive corp/sauvegardes
mc mirror /srv/exports corp/sauvegardes/exports   # synchronisation
mc du corp/sauvegardes
```

Tout client S3 fonctionne aussi : `aws s3 --endpoint-url https://s3.corp.exemple.fr`, `rclone`, `s3cmd`, SDK.

Suite : [[02-iam-protection-exploitation|IAM, protection des données et exploitation]].

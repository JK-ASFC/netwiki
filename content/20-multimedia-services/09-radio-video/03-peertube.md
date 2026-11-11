---
title: PeerTube
description: PeerTube, plate-forme vidéo fédérée de Framasoft (AGPL) — architecture (Node.js, PostgreSQL, Redis, FFmpeg, HLS avec pair-à-pair), installation Docker Compose, production.yaml, comptes et quotas, transcodage et runners distants, stockage objet S3, directs RTMP, fédération et modération, greffons, CLI (reset-password, import), sauvegarde et mises à jour.
tags: [peertube, framasoft, vidéo, fédération, activitypub, hls, docker, s3, live]
icon: video
---

**PeerTube**, développé par l'association française **Framasoft**, est une plate-forme vidéo libre : chaque **instance** héberge ses vidéos et peut se **fédérer** avec d'autres instances (ActivityPub). La lecture se fait en **HLS**, avec un partage **pair-à-pair** entre spectateurs qui soulage le serveur pendant les pics. Usages : vidéothèque d'une collectivité, d'une école, d'une entreprise ou d'une association, alternative à YouTube.

| Composant | Rôle |
| --- | --- |
| PeerTube (Node.js) | Application, API, fédération |
| PostgreSQL | Base de données |
| Redis | Cache, files de tâches |
| FFmpeg | Transcodage (sur le serveur ou des **runners** distants) |
| Nginx (webserver) | Reverse proxy, fichiers statiques, certificats |
| Stockage | Disque local ou **stockage objet S3** |

## Installation avec Docker Compose

```bash
sudo mkdir -p /var/www/peertube/docker-volume && cd /var/www/peertube
sudo curl -fsSL https://raw.githubusercontent.com/Chocobozzz/PeerTube/master/support/docker/production/docker-compose.yml -o docker-compose.yml
sudo curl -fsSL https://raw.githubusercontent.com/Chocobozzz/PeerTube/master/support/docker/production/.env -o .env
sudoedit .env       # PEERTUBE_WEBSERVER_HOSTNAME, mots de passe PostgreSQL, secret, adresse d'administration, SMTP
# Récupérer aussi la configuration Nginx de docker/production (voir la documentation)
sudo docker compose up -d
sudo docker compose logs peertube | grep -A1 -i password    # mot de passe initial du compte root
```

> [!IMPORTANT]
> Le **nom de domaine** de l'instance est définitif : il identifie les comptes et les vidéos dans la fédération.

## Réglages principaux

`config/production.yaml` (ou *Administration → Configuration* pour la plupart des options) :

| Réglage | Conseil |
| --- | --- |
| Inscriptions | Fermées ou sur validation pour une instance d'organisation |
| Quotas | Quota vidéo par utilisateur (par défaut et par compte) |
| Transcodage | Résolutions utiles (360p, 720p, 1080p), **HLS** activé ; désactiver les résolutions inutiles |
| Runners distants | Déporter le transcodage sur d'autres machines (`@peertube/peertube-runner`) |
| Stockage objet | Vidéos sur S3 (MinIO, Garage, hébergeur) pour ne pas saturer le disque |
| Directs | Activer le live, autoriser ou non les rediffusions ; port **1935** (RTMP) ouvert |
| Fédération | Suivre d'autres instances, accepter automatiquement ou non les abonnements |

## Directs

Dans *Publier → Faire un direct*, PeerTube fournit une URL RTMP et une clé pour OBS. Les directs peuvent être **permanents** (même clé réutilisée) et **sauvegardés** en vidéo à la fin.

## Ligne de commande (Docker)

```bash
cd /var/www/peertube
docker compose exec -u peertube peertube npm run reset-password -- -u root
docker compose exec -u peertube peertube npm run create-import-video-file-job -- -v <uuid-vidéo> -i /chemin/fichier.mp4
docker compose exec -u peertube peertube npm run prune-storage      # fichiers orphelins
```

Le client `peertube-cli` (paquet npm `@peertube/peertube-cli`) permet de téléverser ou d'importer des vidéos (y compris depuis une URL) depuis un poste.

## Fédération et modération

- *Administration → Fédération* : instances suivies et abonnées.
- *Administration → Modération* : signalements, listes de blocage de comptes et d'instances, vidéos en attente de validation.
- Pour une instance privée (intranet), ne suivre aucune instance et refuser les abonnements entrants.

## Sauvegarde et mises à jour

```bash
docker compose exec -T postgres pg_dump -U peertube -Fc peertube_prod > peertube-$(date +%F).dump
# Sauvegarder aussi docker-volume/data (vidéos, si stockage local) et docker-volume/config
docker compose pull && docker compose up -d       # mise à jour (lire les notes de version avant)
```

Voir aussi : [[02-owncast|Owncast]] · [[04-mediacms|MediaCMS]]. Commandes : [[90-aide-memoire|aide-mémoire]].

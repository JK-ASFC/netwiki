---
title: Funkwhale
description: Funkwhale, plate-forme audio fédérée (AGPL, Django et Vue) — bibliothèques partagées entre instances via ActivityPub, chaînes et podcasts, API Subsonic ; installation Docker Compose (PostgreSQL, Redis, Nginx), variables .env, import de musique avec funkwhale-manage, fédération et modération, sauvegarde et mises à jour.
tags: [funkwhale, fédération, activitypub, musique, podcasts, docker compose, postgresql, subsonic]
icon: music
---

**Funkwhale** est une plate-forme d'écoute **fédérée** : chaque instance héberge des bibliothèques et des chaînes (artistes, podcasts), et peut suivre celles d'autres instances Funkwhale ou interagir avec le Fediverse (Mastodon…) via **ActivityPub**. Elle expose aussi l'**API Subsonic** pour les applications mobiles.

| Composant | Rôle |
| --- | --- |
| API (Django) et tâches de fond (Celery) | Logique, import, fédération |
| Interface web (Vue) | Écoute, gestion, modération |
| PostgreSQL | Base de données |
| Redis | Cache et file des tâches |
| Nginx (front) | Fichiers statiques, médias, reverse proxy |

## Installation avec Docker Compose

Suivre la procédure officielle (fichiers `docker-compose.yml` et `.env` publiés par le projet pour la version voulue) :

```bash
sudo mkdir -p /srv/funkwhale && cd /srv/funkwhale
# Récupérer docker-compose.yml, env.prod.sample (→ .env) et la configuration Nginx de la version choisie
sudoedit .env       # FUNKWHALE_HOSTNAME, DJANGO_SECRET_KEY, chemins des médias et de la musique
docker compose pull
docker compose up -d postgres redis
docker compose run --rm api funkwhale-manage migrate
docker compose run --rm api funkwhale-manage fw users create --superuser
docker compose up -d
```

Variables importantes du `.env` :

| Variable | Rôle |
| --- | --- |
| `FUNKWHALE_HOSTNAME` | Nom de domaine public (définitif : il identifie l'instance dans la fédération) |
| `DJANGO_SECRET_KEY` | Clé secrète longue et aléatoire |
| `MEDIA_ROOT`, `MUSIC_DIRECTORY_PATH` | Médias téléversés et dossier de musique existant (import « in-place ») |
| `FUNKWHALE_WEB_WORKERS` | Nombre de processus web |

Placer un reverse proxy HTTPS (Nginx, Caddy, Traefik) devant le conteneur front : la fédération exige HTTPS.

## Importer de la musique

1. Dans l'interface : créer une **bibliothèque** (privée, instance ou publique) et noter son identifiant.
2. Importer sans recopier les fichiers :

```bash
docker compose run --rm api funkwhale-manage import_files <id-bibliothèque> "/music/**/*.flac" --recursive --noinput --in-place
```

## Fédération et modération

- Suivre la bibliothèque publique d'une autre instance depuis *Bibliothèques → Découvrir*.
- *Administration → Modération* : bloquer des domaines ou des comptes, traiter les signalements.
- Pour une instance purement privée, désactiver la fédération dans les réglages de l'instance.

## Sauvegarde et mises à jour

```bash
docker compose exec -T postgres pg_dumpall -U postgres > funkwhale-$(date +%F).sql
tar czf funkwhale-medias-$(date +%F).tgz data/media .env
# Mise à jour : changer FUNKWHALE_VERSION dans .env, puis
docker compose pull && docker compose up -d && docker compose run --rm api funkwhale-manage migrate
```

Voir aussi : [[01-comparatif|choisir un serveur de musique]]. Commandes : [[90-aide-memoire|aide-mémoire]].

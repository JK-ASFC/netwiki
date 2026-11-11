---
title: MediaCMS
description: MediaCMS, portail vidéo et multimédia d'organisation (Django et React, AGPL) — fonctions (vidéos, audio, images, listes, catégories, sous-titres, rôles et modération, flux de publication), installation Docker Compose, variables et compte administrateur, transcodage Celery et HLS, authentification SAML, intégration LMS, sauvegarde ; comparaison avec PeerTube.
tags: [mediacms, vidéo, portail, django, docker compose, hls, saml, organisation]
icon: video
---

**MediaCMS** est un « YouTube interne » pour une organisation : publication de vidéos, d'audio, d'images et de PDF, catégories, listes de lecture, sous-titres, commentaires, et surtout des **rôles** et un **flux de publication** (contenus en attente de validation, privés, non listés, publics).

| | MediaCMS | PeerTube |
| --- | --- | --- |
| Orientation | Portail **interne** d'une organisation | Plate-forme **fédérée** |
| Fédération | Non | Oui (ActivityPub) |
| Contrôle d'accès | Rôles, publication modérée, contenus privés, **SAML** et RBAC par catégorie | Comptes locaux, plugins d'authentification |
| Médias | Vidéo, audio, image, PDF | Vidéo, audio |
| Technologie | Django, Celery, PostgreSQL, Redis, React | Node.js, PostgreSQL, Redis |

## Installation avec Docker Compose

```bash
sudo git clone https://github.com/mediacms-io/mediacms /opt/mediacms && cd /opt/mediacms
sudoedit docker-compose.yaml        # ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD (sinon généré), FRONTEND_HOST
sudo docker compose up -d
sudo docker compose logs migrations | grep -i password    # mot de passe administrateur s'il a été généré
```

Une variante `docker-compose-letsencrypt.yaml` ajoute un reverse proxy avec certificats automatiques. Les réglages avancés se placent dans `deploy/docker/local_settings.py` (nom du portail, inscriptions, SMTP, langues, durée maximale des vidéos…).

## Exploitation

| Sujet | Détail |
| --- | --- |
| Transcodage | Tâches **Celery** (conteneurs `celery_worker`) : plusieurs résolutions et **HLS** ; prévoir du processeur ou plusieurs workers |
| Publication | Modes : tout publier, ou **validation par un éditeur** avant mise en ligne |
| Rôles | Utilisateur, éditeur, gestionnaire, administrateur ; droits par catégorie (RBAC) |
| Authentification | Comptes locaux, **SAML** (Keycloak, AD FS, Entra ID), intégration LMS (Moodle, LTI) selon les versions |
| Sous-titres | Ajout de fichiers ; transcription automatique avec Whisper selon les versions |

```bash
docker compose exec web python manage.py createsuperuser        # autre administrateur
docker compose exec web python manage.py changepassword admin
docker compose ps ; docker compose logs -f celery_worker
```

## Sauvegarde

```bash
docker compose exec -T db pg_dump -U mediacms -Fc mediacms > mediacms-$(date +%F).dump
tar czf mediacms-media-$(date +%F).tgz media_files deploy/docker/local_settings.py
```

Voir aussi : [[03-peertube|PeerTube]]. Commandes : [[90-aide-memoire|aide-mémoire]].

---
title: AppFlowy et AFFiNE
description: Espaces de travail libres type Notion — AppFlowy (AGPL : documents, bases de données, kanban, calendrier ; applications Windows, macOS, Linux, mobiles ; serveur AppFlowy Cloud auto-hébergé en Docker Compose, deploy.env, FQDN, compte administrateur GoTrue, console /console) et AFFiNE (MIT pour l'édition communautaire : documents et tableau blanc illimité, bases ; application de bureau ; serveur Docker ghcr.io/toeverything/affine avec PostgreSQL pgvector et Redis, port 3010), installation, sécurité et sauvegarde.
tags: [appflowy, affine, notion, espace de travail, docker, collaboration]
icon: notebook-tabs
---

| | **AppFlowy** | **AFFiNE** |
| --- | --- | --- |
| Licence | AGPL v3 | MIT (édition communautaire) |
| Contenu | Documents, bases de données (grille, kanban, calendrier), IA facultative | Documents + **tableau blanc** (*edgeless*), bases de données |
| Clients | Windows, macOS, Linux, Android, iOS, web | Navigateur, Windows, macOS, Linux, mobiles |
| Hors ligne | Oui (stockage local, synchronisation) | Oui (local d'abord) |
| Serveur | AppFlowy Cloud (Rust, PostgreSQL, Redis, MinIO, GoTrue) | Serveur AFFiNE (Node.js, PostgreSQL + pgvector, Redis) |

Les deux s'utilisent **sans serveur** (données locales sur le poste) ; le serveur auto-hébergé ajoute la synchronisation et le partage. Pour un wiki d'équipe classique : [[01-outline-wikijs|Outline, Wiki.js]].

## Clients

```powershell
winget install --id AppFlowy.AppFlowy -e
```

```bash
brew install --cask appflowy
```

AFFiNE : application de bureau depuis le site de l'éditeur ou les versions GitHub, ou directement dans le navigateur à l'adresse du serveur auto-hébergé.

## AppFlowy Cloud (Docker Compose)

```bash
git clone https://github.com/AppFlowy-IO/AppFlowy-Cloud.git && cd AppFlowy-Cloud
cp deploy.env .env
nano .env        # FQDN=notes.corp.exemple.fr, SCHEME=https, WS_SCHEME=wss, GOTRUE_ADMIN_EMAIL, GOTRUE_ADMIN_PASSWORD, secrets et mots de passe
docker compose up -d
```

La pile (NGINX, serveur AppFlowy, GoTrue pour l'authentification, PostgreSQL, Redis, MinIO, interface d'administration) écoute sur 80 et 443 (`NGINX_PORT`, `NGINX_TLS_PORT`). L'interface d'administration des utilisateurs est sur `https://notes.corp.exemple.fr/console`. Dans l'application de bureau : *Paramètres → Cloud → Auto-hébergé*, puis saisir l'adresse du serveur.

<!-- CAPTURE: Console d'administration AppFlowy Cloud | _assets/appflowy-console.png -->

## AFFiNE auto-hébergé

```bash
mkdir -p /opt/affine && cd /opt/affine
wget -O compose.yaml https://raw.githubusercontent.com/toeverything/AFFiNE/canary/.docker/selfhost/compose.yml
docker compose up -d
docker compose logs -f affine        # le conteneur affine_migration prépare la base au premier démarrage
```

Le service écoute sur le port **3010** (à publier par un reverse proxy TLS avec WebSocket) ; les fichiers sont dans `./data/storage` et la configuration dans `./config`. Le premier compte créé dans `https://affine.corp.exemple.fr` est l'administrateur de l'instance (*paramètres d'administration* : utilisateurs, inscription, SMTP).

<!-- CAPTURE: Document AFFiNE en mode tableau blanc | _assets/affine-tableau-blanc.png -->

## Exploitation

- Fermer l'inscription libre, imposer HTTPS, ne pas exposer PostgreSQL, Redis ni MinIO.
- Sauvegarde : bases PostgreSQL et stockage des fichiers (volume MinIO pour AppFlowy, `./data/storage` pour AFFiNE).
- Mise à jour : `git pull` (AppFlowy) ou nouveau `compose.yaml` (AFFiNE), puis `docker compose pull && docker compose up -d`.

Commandes : [[90-aide-memoire|aide-mémoire]].

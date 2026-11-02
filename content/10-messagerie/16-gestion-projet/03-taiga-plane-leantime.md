---
title: Taiga, Plane et Leantime
description: Trois outils de gestion de projet modernes auto-hébergés en Docker — Taiga (agilité scrum et kanban, epics, user stories, sprints ; taiga-docker, .env, launch-taiga.sh, taiga-manage.sh), Plane Community (alternative libre à Jira et Linear : issues, cycles, modules, vues ; script setup.sh, plane.env, sauvegarde) et Leantime (gestion de projet pour non-spécialistes, objectifs, idées, temps ; docker-leantime, variables LEAN_*), reverse proxy, comptes, sauvegarde et mise à jour.
tags: [taiga, plane, leantime, agile, scrum, kanban, docker, gestion de projet]
icon: layout-dashboard
---

| Outil | Licence | Public | Points forts |
| --- | --- | --- | --- |
| **Taiga** | MPL 2.0 | Équipes agiles | Scrum (backlog, sprints, burndown) et kanban, epics, import Jira/Trello |
| **Plane** (Community) | AGPL v3 | Équipes produit et développement | Interface proche de Linear/Jira, cycles, modules, vues, pages, intégrations GitHub/GitLab |
| **Leantime** | AGPL v3 | Équipes non techniques, PME | Projets, objectifs, idées, kanban, Gantt, temps passé, interface simple |

Les trois s'installent avec **Docker Compose** sous Linux (et sous Windows ou macOS avec Docker Desktop). Alternatives plus complètes : [[01-openproject|OpenProject]], [[02-redmine|Redmine]].

## Taiga

```bash
git clone https://github.com/taigaio/taiga-docker.git && cd taiga-docker
git checkout stable
nano .env          # TAIGA_SCHEME=https, TAIGA_DOMAIN=agile.corp.exemple.fr, SECRET_KEY, mots de passe PostgreSQL et RabbitMQ, SMTP
./launch-taiga.sh
./taiga-manage.sh createsuperuser
```

L'application écoute sur le port **9000** (à publier par un reverse proxy, avec la prise en charge des WebSockets pour `/events`). `taiga-manage.sh` lance les commandes d'administration Django (`./taiga-manage.sh help`).

<!-- CAPTURE: Backlog scrum d'un projet Taiga | _assets/taiga-backlog.png -->

Sauvegarde : base PostgreSQL du conteneur `taiga-db` et volume des médias (`taiga-media-data`) ; mise à jour : `git pull` sur la branche `stable`, puis `./launch-taiga.sh`.

```bash
docker compose exec -T taiga-db sh -c 'pg_dump -U "$POSTGRES_USER" taiga' > /srv/sauvegardes/taiga-$(date +%F).sql
```

## Plane (Community Edition)

```bash
mkdir -p /opt/plane && cd /opt/plane
curl -fsSL -o setup.sh https://github.com/makeplane/plane/releases/latest/download/setup.sh
chmod +x setup.sh
./setup.sh         # menu : 1) Install, 2) Start, 3) Stop, 4) Restart, 5) Upgrade, 6) View Logs, 7) Backup Data
```

L'installation crée le dossier `plane-app` avec `docker-compose.yaml` et **`plane.env`**. Avant de démarrer, y renseigner :

```ini
LISTEN_HTTP_PORT=8080
WEB_URL=https://plane.corp.exemple.fr
CORS_ALLOWED_ORIGINS=https://plane.corp.exemple.fr
```

Ouvrir ensuite `https://plane.corp.exemple.fr/god-mode/` pour créer l'**administrateur de l'instance** (paramètres SMTP, authentification Google/GitHub/GitLab/OIDC, stockage), puis l'espace de travail. Arrêter les services avant de modifier `plane.env`. Mise à jour : télécharger le dernier `setup.sh`, puis option *Upgrade* ; sauvegarde : option *Backup Data* (base, Redis, fichiers MinIO). Pour Docker Swarm, utiliser `swarm.sh`.

<!-- CAPTURE: Liste des issues d'un projet Plane (vue tableau) | _assets/plane-issues.png -->

## Leantime

```bash
git clone https://github.com/Leantime/docker-leantime.git && cd docker-leantime
cp sample.env .env
nano .env
docker compose up -d
```

Variables essentielles de `.env` :

```ini
LEAN_PORT = '8080'
LEAN_APP_URL = 'https://projets-equipe.corp.exemple.fr'
LEAN_DB_PASSWORD = 'MdpLeantime2026'
MYSQL_PASSWORD = 'MdpLeantime2026'
MYSQL_ROOT_PASSWORD = 'MdpRootMysql2026'
LEAN_SESSION_PASSWORD = 'remplacer_par_une_chaine_aleatoire_longue'
LEAN_LANGUAGE = 'fr-FR'
LEAN_DEFAULT_TIMEZONE = 'Europe/Paris'
LEAN_EMAIL_USE_SMTP = true
LEAN_EMAIL_SMTP_HOSTS = 'smtp.corp.exemple.fr'
```

`LEAN_DB_PASSWORD` doit être identique à `MYSQL_PASSWORD`. Ouvrir `https://projets-equipe.corp.exemple.fr/install` pour créer le compte administrateur. Leantime propose aussi une installation classique sur LAMP (archive à extraire, racine `public/`) et l'authentification LDAP (`LEAN_LDAP_*`).

<!-- CAPTURE: Tableau de bord d'un projet Leantime | _assets/leantime-tableau-de-bord.png -->

## Points communs d'exploitation

- Reverse proxy TLS ([[03-nginx/05-reverse-proxy-repartition|NGINX]], [[04-traefik/01-presentation-installation|Traefik]]) avec WebSockets, ports applicatifs liés à `127.0.0.1`.
- Inscription libre désactivée, comptes créés par invitation ou SSO.
- Sauvegarde régulière des volumes (base et fichiers) et test de restauration ; lecture des notes de version avant chaque mise à jour majeure.

Commandes : [[90-aide-memoire|aide-mémoire]].

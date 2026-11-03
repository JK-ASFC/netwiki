---
title: Gogs, OneDev, SourceHut, Pagure et RhodeCode
description: Forges de code alternatives à GitLab et Gitea — Gogs (MIT, Go : très léger ; Docker gogs/gogs avec app.ini obligatoire, ports 3000 et 22, binaire), OneDev (MIT, Java : forge avec CI/CD, tickets et recherche de code intégrés ; Docker 1dev/server, ports 6610 et 6611), SourceHut (AGPL : forge orientée courriel et listes de diffusion, auto-hébergement complexe), Pagure (GPL, Python : forge de Fedora, en retrait) et RhodeCode (forge Git, Mercurial et Subversion d'entreprise), choix et exploitation.
tags: [gogs, onedev, sourcehut, pagure, rhodecode, forge, git]
icon: git-branch
---

Forges principales du wiki : [[02-gitlab/01-presentation-installation|GitLab]], [[03-gitea/01-presentation-installation|Gitea]], [[04-forgejo/01-presentation-installation|Forgejo]] et, pour une forge ALM, [[04-tuleap-trac-phorge|Tuleap, Trac et Phorge]].

| Forge | Licence | Socle | Points forts |
| --- | --- | --- | --- |
| **Gogs** | MIT | Go | Ancêtre de Gitea, binaire unique très léger ; évolutions plus lentes que Gitea/Forgejo |
| **OneDev** | MIT | Java | CI/CD, tickets, tableaux, recherche sémantique du code intégrés, tout en un conteneur |
| **SourceHut** | AGPL | Go, Python | Flux par **courriel** (patchs, listes), CI `builds.sr.ht`, très sobre |
| **Pagure** | GPL | Python | Forge de Fedora ; Fedora migre vers Forgejo : réservé à l'existant |
| **RhodeCode** | AGPL (Community) / commerciale | Python | Git, **Mercurial** et **Subversion** dans une même forge, droits fins |

## Gogs

Gogs refuse de démarrer sans fichier `app.ini` et avec la clé secrète par défaut :

```bash
sudo mkdir -p /srv/gogs/gogs/conf
sudo tee /srv/gogs/gogs/conf/app.ini >/dev/null <<'INI'
RUN_MODE = prod
RUN_USER = git
[server]
EXTERNAL_URL = https://git.corp.exemple.fr/
DOMAIN       = git.corp.exemple.fr
SSH_PORT     = 10022
START_SSH_SERVER = false
[repository]
ROOT = /home/git/gogs-repositories
[database]
TYPE     = postgres
HOST     = srv-pg-01.corp.exemple.fr:5432
NAME     = gogs
USER     = gogs
PASSWORD = ${GOGS_DATABASE_PASSWORD}
[security]
SECRET_KEY = ${GOGS_SECURITY_SECRET_KEY}
INI
docker run -d --name gogs -p 10022:22 -p 127.0.0.1:10880:3000 -v /srv/gogs:/data \
  -e GOGS_DATABASE_PASSWORD=MdpGogs2026 -e GOGS_SECURITY_SECRET_KEY=$(uuidgen) gogs/gogs
```

Les valeurs `${...}` sont lues dans l'environnement du conteneur (secrets hors du fichier). Sans Docker : binaire unique pour Linux, Windows et macOS (`./gogs web`), même `custom/conf/app.ini`. Le premier compte inscrit devient administrateur ; désactiver ensuite l'inscription libre (`[auth] DISABLE_REGISTRATION = true`). Pour un nouveau projet, Gitea ou Forgejo offrent davantage de fonctions (actions CI, paquets).

## OneDev

```bash
docker run -d --name onedev -v /var/run/docker.sock:/var/run/docker.sock -v /srv/onedev:/opt/onedev \
  -p 127.0.0.1:6610:6610 -p 6611:6611 1dev/server
```

Port **6610** : interface web (reverse proxy TLS) ; **6611** : SSH Git. L'accès au socket Docker permet aux tâches CI de lancer des conteneurs ; à défaut, déclarer des agents (*Administration → Agents*). Le premier écran crée l'administrateur et l'adresse du serveur. Base intégrée par défaut, PostgreSQL ou MySQL en production. Version Java autonome (archive) pour Linux, Windows et macOS.

<!-- CAPTURE: Projet OneDev avec pipeline CI et tickets | _assets/onedev-projet.png -->

## SourceHut

**SourceHut** (sr.ht) se compose de services séparés (`git.sr.ht`, `hg.sr.ht`, `lists.sr.ht`, `todo.sr.ht`, `builds.sr.ht`, `meta.sr.ht`…) en Go et Python, avec PostgreSQL, Redis et un relais SMTP. Son auto-hébergement est réservé aux équipes expérimentées (paquets fournis pour Alpine Linux, configuration commune `config.ini`) ; l'instance publique sr.ht est l'usage le plus courant. Le flux de contribution repose sur `git send-email` et les listes de diffusion.

## Pagure

**Pagure** (Python/Flask) reste disponible dans Fedora et EPEL (`dnf install pagure`, PostgreSQL, Redis, Celery). Fedora déplace ses dépôts vers Forgejo : pour une nouvelle forge, choisir Forgejo ; pour une instance existante, planifier la migration (import des dépôts et tickets).

## RhodeCode

**RhodeCode** gère dans une même forge des dépôts **Git**, **Mercurial** et **Subversion**, avec revues de code, droits par groupe et intégrations LDAP/AD. L'éditeur fournit des installations par conteneurs (Docker Compose) ; vérifier l'édition (Community ou Enterprise) et ses conditions avant le déploiement. Atout principal : migrer progressivement d'un parc Subversion/Mercurial vers Git sans changer d'outil.

Commandes : [[90-aide-memoire|aide-mémoire]].

---
title: Kanboard, Wekan, Focalboard et Vikunja
description: Tableaux kanban et gestion de tâches auto-hébergés — Kanboard (PHP, MIT : minimaliste, SQLite ou MySQL/PostgreSQL, Docker kanboard/kanboard, cron, extensions, LDAP), Wekan (Meteor, MIT : snap, Docker, Windows), Focalboard (archivé, remplacé par Mattermost Boards) et Vikunja (Go, AGPL : listes, kanban, Gantt, tableau, binaire unique, Docker vikunja/vikunja, CLI vikunja user), installation sous Linux, Windows et macOS, sauvegarde et mise à jour.
tags: [kanboard, wekan, focalboard, vikunja, kanban, tâches, docker]
icon: kanban
---

| Outil | Licence | Socle | Points forts |
| --- | --- | --- | --- |
| **Kanboard** | MIT | PHP | Très léger, un seul tableau kanban par projet, automatisations, extensions |
| **Wekan** | MIT | Meteor (Node.js) + MongoDB | Clone libre de Trello, listes, cartes, sous-tâches, multi-tableaux |
| **Focalboard** | MIT/AGPL | Go | **Archivé** : fonctions reprises dans *Mattermost Boards* ([[12-mattermost/01-presentation-installation\|Mattermost]]) |
| **Vikunja** | AGPL v3 | Go + Vue | Listes de tâches, kanban, Gantt et tableau, partage, CalDAV, application mobile |

Pour une gestion de projet plus complète : [[01-openproject|OpenProject]], [[03-taiga-plane-leantime|Taiga, Plane, Leantime]].

## Kanboard

```bash
docker run -d --name kanboard -p 127.0.0.1:8081:80 \
  -v kanboard_data:/var/www/app/data -v kanboard_plugins:/var/www/app/plugins kanboard/kanboard:latest
```

Installation classique (Linux, Windows avec IIS ou Apache, macOS) : extraire l'archive des versions publiées dans la racine web (PHP 8 avec `pdo_sqlite`, ou `pdo_mysql`/`pdo_pgsql`), rendre `data/` inscriptible par le serveur web. Base **SQLite** par défaut ; pour MySQL ou PostgreSQL, copier `config.default.php` en `config.php` et renseigner `DB_DRIVER`, `DB_HOSTNAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.

Premier accès : **`admin` / `admin`** (à changer). Tâche planifiée quotidienne (rappels, tâches en retard, automatisations) :

```bash
echo '0 8 * * * www-data cd /var/www/kanboard && ./cli cronjob >/dev/null 2>&1' | sudo tee /etc/cron.d/kanboard
```

LDAP/Active Directory : constantes `LDAP_AUTH`, `LDAP_SERVER`, `LDAP_BIND_TYPE`, `LDAP_USER_BASE_DN`, `LDAP_USER_FILTER` dans `config.php`. Sauvegarde : dossier `data/` (base SQLite et fichiers) ou dump de la base externe.

<!-- CAPTURE: Tableau kanban d'un projet Kanboard | _assets/kanboard-tableau.png -->

## Wekan

```bash
sudo snap install wekan
sudo snap set wekan root-url='https://kanban.corp.exemple.fr'
sudo snap set wekan port='3001'
sudo systemctl restart snap.wekan.wekan
```

Le snap embarque MongoDB et Node.js ; reverse proxy TLS vers le port 3001 (WebSocket requis). Variante Docker Compose (Wekan + MongoDB) fournie par le dépôt `wekan/wekan`, image `wekanteam/wekan`, avec `ROOT_URL` et `MONGO_URL` comme variables essentielles. Le projet publie aussi des paquets autonomes pour Windows et macOS. Le premier compte inscrit devient administrateur ; désactiver ensuite l'inscription libre dans *Paramètres d'administration*.

<!-- CAPTURE: Tableau Wekan avec listes et cartes | _assets/wekan-tableau.png -->

## Focalboard (archivé)

Focalboard n'est plus maintenu : ne pas l'installer pour un nouveau besoin. Les tableaux existants s'exportent (archive `.boardarchive`) et s'importent dans **Mattermost Boards** ; à défaut, migrer vers Kanboard, Wekan ou Vikunja.

## Vikunja

```bash
docker run -d --name vikunja -p 127.0.0.1:3456:3456 \
  -e VIKUNJA_SERVICE_PUBLICURL=https://taches.corp.exemple.fr/ \
  -v /srv/vikunja/files:/app/vikunja/files -v /srv/vikunja/db:/db vikunja/vikunja
```

Base **SQLite** par défaut (fichier dans `/db`) ; pour PostgreSQL ou MySQL, variables `VIKUNJA_DATABASE_TYPE`, `VIKUNJA_DATABASE_HOST`, `VIKUNJA_DATABASE_USER`, `VIKUNJA_DATABASE_PASSWORD`, `VIKUNJA_DATABASE_DATABASE`. Hors conteneur : binaire unique (Linux, Windows, macOS) ou paquets `.deb`/`.rpm`, configuration dans `config.yml`, service systemd.

```bash
docker exec vikunja /app/vikunja/vikunja user create -u jk -e jk@corp.exemple.fr -p 'MdpTemporaire2026!'
docker exec vikunja /app/vikunja/vikunja user list
```

Fonctions : projets et sous-projets, vues liste/kanban/Gantt/tableau, étiquettes, rappels, partage par lien ou équipe, **CalDAV** pour les tâches, authentification OpenID Connect et LDAP. Sauvegarde : base et dossier `files`.

<!-- CAPTURE: Vue kanban d'un projet Vikunja | _assets/vikunja-kanban.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

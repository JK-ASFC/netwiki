---
title: Tuleap, Trac et Phorge (Phabricator)
description: Forges de gestion du cycle de vie logiciel auto-hébergées — Tuleap Community (ALM : agilité, trackers, Git, documents, tests ; image Docker tuleap/tuleap-community-edition avec MySQL et Redis, RHEL/Alma 9), Trac (Python : tickets, wiki, chronologie, navigateur de dépôt ; pip, trac-admin initenv, tracd, Apache mod_wsgi, permissions), Phorge (successeur libre de Phabricator archivé : revue de code Differential, Maniphest, Diffusion ; LAMP, bin/config, bin/storage upgrade, bin/phd, arcanist), installation, administration et migration.
tags: [tuleap, trac, phorge, phabricator, alm, forge, revue de code]
icon: git-branch
---

Ces outils regroupent suivi de tâches, wiki, dépôts de code et revue dans une **forge** intégrée. Pour une forge centrée sur Git (fusion, CI), voir aussi [[02-gitlab/01-presentation-installation|GitLab]], [[03-gitea/01-presentation-installation|Gitea]] et [[04-forgejo/01-presentation-installation|Forgejo]].

| Outil | Licence | Langage | Usage typique |
| --- | --- | --- | --- |
| **Tuleap Community** | GPL v2 | PHP | ALM complet (agilité, exigences, tests, documents, Git), secteurs réglementés |
| **Trac** | BSD | Python | Petits projets : tickets + wiki + navigation Git/SVN, très léger |
| **Phorge** | Apache 2.0 | PHP | Revue de code (Differential), tâches (Maniphest), dépôts (Diffusion) |
| Phabricator | Apache 2.0 | PHP | **Archivé depuis 2021** : migrer vers Phorge (même base de code, compatible) |

## Tuleap Community (Docker)

Tuleap s'exécute sur RHEL / AlmaLinux / Rocky 9 (paquets RPM) ou en **conteneur** ; l'image communautaire est `tuleap/tuleap-community-edition`. Fichier `compose.yaml` :

```yaml
services:
  web:
    image: tuleap/tuleap-community-edition
    hostname: ${TULEAP_FQDN}
    restart: always
    ports: ["80:80", "443:443", "22:22"]
    volumes: ["tuleap-data:/data"]
    depends_on: [db, redis]
    environment:
      - TULEAP_FQDN=${TULEAP_FQDN}
      - TULEAP_SYS_DBHOST=db
      - TULEAP_SYS_DBPASSWD=${TULEAP_SYS_DBPASSWD}
      - SITE_ADMINISTRATOR_PASSWORD=${SITE_ADMINISTRATOR_PASSWORD}
      - DB_ADMIN_USER=root
      - DB_ADMIN_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - TULEAP_FPM_SESSION_MODE=redis
      - TULEAP_REDIS_SERVER=redis
  db:
    image: mysql:8.4
    restart: always
    environment: ["MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}"]
    volumes: ["db-data:/var/lib/mysql"]
  redis:
    image: redis:7
    restart: always
    volumes: ["redis-data:/data"]
volumes: { tuleap-data: {}, db-data: {}, redis-data: {} }
```

```bash
cat > .env <<'ENV'
TULEAP_FQDN=forge.corp.exemple.fr
TULEAP_SYS_DBPASSWD=MdpTuleapDb2026
SITE_ADMINISTRATOR_PASSWORD=MdpAdminTuleap2026
MYSQL_ROOT_PASSWORD=MdpRootMysql2026
ENV
docker compose up -d && docker compose logs -f web      # attendre la fin de l'initialisation
```

Le port 22 sert aux accès Git en SSH (déplacer le SSH de l'hôte sur un autre port). Ouvrir `https://forge.corp.exemple.fr` avec le compte `admin` et le mot de passe défini ; *Administration du site* gère utilisateurs, LDAP, extensions et modèles de projet.

<!-- CAPTURE: Tableau agile (cardwall) d'un projet Tuleap | _assets/tuleap-cardwall.png -->

## Trac

```bash
sudo apt install -y python3-venv apache2-utils
sudo python3 -m venv /opt/trac && sudo /opt/trac/bin/pip install Trac
sudo /opt/trac/bin/trac-admin /srv/trac/infra initenv "Projet infrastructure" sqlite:db/trac.db
sudo htpasswd -c /srv/trac/infra/.htpasswd jk
sudo /opt/trac/bin/trac-admin /srv/trac/infra permission add jk TRAC_ADMIN
sudo /opt/trac/bin/tracd --port 8000 --basic-auth="infra,/srv/trac/infra/.htpasswd,Trac" /srv/trac/infra     # essai
```

En production : Apache avec `mod_wsgi` (script généré par `trac-admin /srv/trac/infra deploy /srv/trac/deploy`) ou `tracd` derrière un reverse proxy. Dépôts : *Admin → Repositories* (Git avec l'extension intégrée `tracopt.versioncontrol.git`, à activer dans `trac.ini`). Sous Windows et macOS : même installation par `pip` dans un environnement Python.

## Phorge

```bash
sudo apt install -y apache2 mariadb-server git php php-mysql php-curl php-mbstring php-gd php-zip php-apcu libapache2-mod-php
cd /var/www && sudo git clone https://github.com/phorgeit/arcanist.git && sudo git clone https://github.com/phorgeit/phorge.git
sudo git config --system --add safe.directory /var/www/arcanist && sudo git config --system --add safe.directory /var/www/phorge
cd /var/www/phorge
sudo ./bin/config set phabricator.base-uri 'https://phorge.corp.exemple.fr/'
sudo ./bin/config set mysql.host localhost
sudo ./bin/config set mysql.user phorge
sudo ./bin/config set mysql.pass 'MdpPhorge2026'
sudo ./bin/storage upgrade          # crée et migre les bases
sudo ./bin/phd start                # démons (dépôts, tâches, notifications)
```

Virtual host Apache : `DocumentRoot /var/www/phorge/webroot` et réécriture de toutes les URL vers `/index.php` (voir la documentation d'installation). Phorge doit occuper un **domaine entier** (pas de sous-répertoire). Le premier compte créé dans l'interface devient administrateur ; *Config → Setup Issues* liste les réglages restant à corriger.

Migration depuis Phabricator : remplacer les dépôts `phabricator`/`arcanist` par ceux de Phorge, puis `./bin/storage upgrade` et redémarrer les démons ; les données sont conservées.

<!-- CAPTURE: Revue de code Differential dans Phorge | _assets/phorge-differential.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

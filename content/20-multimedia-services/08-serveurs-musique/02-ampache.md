---
title: Ampache
description: Ampache, serveur de musique et de vidéo en PHP (AGPL) — installation Docker ou classique (PHP, Composer, MariaDB, dossier public/), catalogues locaux et distants, utilisateurs et droits, transcodage FFmpeg, API Ampache et Subsonic pour les clients mobiles, reverse proxy, tâches cron de mise à jour des catalogues et sauvegarde.
tags: [ampache, musique, php, mariadb, subsonic, docker, streaming]
icon: music
---

**Ampache** est l'un des plus anciens serveurs de musique libres (depuis 2001). Il gère de **très grosses bibliothèques** réparties en plusieurs **catalogues**, plusieurs utilisateurs avec des droits fins, les vidéos et les podcasts, et expose l'**API Ampache** et l'**API Subsonic** pour les applications mobiles.

## Installation avec Docker

L'image officielle embarque Apache, PHP et MariaDB :

```bash
docker run -d --name ampache --restart unless-stopped \
  -p 8080:80 \
  -v ampache_config:/var/www/config \
  -v ampache_log:/var/log/ampache \
  -v ampache_mysql:/var/lib/mysql \
  -v /srv/musique:/media:ro \
  ampache/ampache:latest
```

Ouvrir `http://serveur:8080` et suivre l'assistant (base de données, compte administrateur). Les identifiants MariaDB internes sont indiqués dans les journaux du conteneur (`docker logs ampache`).

## Installation classique (Debian)

```bash
sudo apt install apache2 mariadb-server ffmpeg \
  php php-mysql php-curl php-gd php-intl php-xml php-mbstring php-zip composer
cd /var/www && sudo git clone -b release7 https://github.com/ampache/ampache.git
cd ampache && sudo -u www-data composer install --no-dev
sudo mysql -e "CREATE DATABASE ampache; CREATE USER 'ampache'@'localhost' IDENTIFIED BY 'MotDePasse'; GRANT ALL ON ampache.* TO 'ampache'@'localhost';"
```

La racine web du site doit pointer vers **`/var/www/ampache/public`** (jamais la racine du dépôt). Branche à adapter à la dernière version stable.

## Exploitation

| Tâche | Où |
| --- | --- |
| Ajouter un catalogue | *Administration → Catalogues → Ajouter* : chemin local (`/media`), ou catalogue distant (autre Ampache, Subsonic, Beets) |
| Mettre à jour les catalogues | Bouton dans l'interface, ou cron (ci-dessous) |
| Utilisateurs et niveaux d'accès | *Administration → Utilisateurs* (Invité, Utilisateur, Gestionnaire, Administrateur) |
| Transcodage | *Préférences → Lecture* : format et débit par défaut ; FFmpeg requis |
| Clés d'API | Profil utilisateur → *Clé API* (clients Ampache comme Amperfy, Power Ampache) |
| Subsonic | Activer l'API Subsonic, puis utiliser les clients Subsonic avec l'URL du serveur |

```bash
# Mise à jour nocturne des catalogues (installation classique)
0 3 * * * www-data php /var/www/ampache/bin/cli run:updateCatalog -c -a -g
```

## Sécurité et sauvegarde

- Reverse proxy HTTPS devant Ampache ; désactiver l'inscription publique.
- Sauvegarder la base MariaDB (`mariadb-dump ampache > ampache.sql`) et le dossier `config/` (fichier `ampache.cfg.php`).

Voir aussi : [[01-comparatif|choisir un serveur de musique]]. Commandes : [[90-aide-memoire|aide-mémoire]].

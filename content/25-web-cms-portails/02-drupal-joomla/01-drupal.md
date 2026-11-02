---
title: Drupal
description: Drupal (GPL v2) — CMS PHP pour sites institutionnels, portails et applications de contenu : types de contenu, taxonomies, vues, rôles et permissions fins, multilingue natif, Drupal CMS ; installation par Composer (drupal/recommended-project, drupal/cms), Drush (site:install, cr, updb, cex, cim, uli), NGINX ou Apache, Docker, configuration settings.php (trusted_host_patterns, private file path), mises à jour, sauvegarde et dépannage.
tags: [drupal, cms, php, composer, drush, multilingue]
icon: droplet
---

**Drupal** (GPL v2) est un CMS orienté **structure** : types de contenu et champs, taxonomies, **Vues** (listes et requêtes sans code), rôles et permissions très fins, **multilingue** natif, API (JSON:API, REST). Il est utilisé par de nombreux sites publics et universitaires. **Drupal CMS** est une distribution prête à l'emploi (recettes, extensions choisies) bâtie sur le même cœur. Drupal 11 est la version actuelle.

Prérequis : PHP 8.3+ (`gd`, `pdo_mysql`/`pdo_pgsql`, `xml`, `mbstring`, `opcache`, `curl`), MySQL 8/MariaDB 10.6+ ou PostgreSQL 16+, **Composer**, Apache ou NGINX.

## Installation (Composer et Drush)

```bash
sudo apt install -y nginx mariadb-server composer php-fpm php-mysql php-gd php-xml php-mbstring php-curl php-zip php-intl php-apcu
sudo mariadb -e "CREATE DATABASE drupal CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci; CREATE USER 'drupal'@'localhost' IDENTIFIED BY 'MdpDrupal2026'; GRANT ALL ON drupal.* TO 'drupal'@'localhost';"
cd /var/www && sudo composer create-project drupal/recommended-project portail      # ou drupal/cms
cd portail && sudo composer require drush/drush
sudo vendor/bin/drush site:install standard --db-url=mysql://drupal:MdpDrupal2026@localhost/drupal \
  --site-name="Portail de l'entreprise" --account-name=jk-admin --account-pass='MdpAdmin2026!' --locale=fr -y
sudo chown -R www-data:www-data web/sites/default/files
```

Racine web : `/var/www/portail/web` ; NGINX : `try_files $uri /index.php?$query_string;` et passage des `.php` à PHP-FPM, refus des fichiers `*.yml`, `*.twig`, `composer.*`. Windows : IIS ou Apache avec PHP et Composer, même procédure ; macOS : PHP et Composer de Homebrew. Environnement de développement : **DDEV** (Docker) `ddev config --project-type=drupal11 && ddev start`.

Dans `web/sites/default/settings.php` :

```php
$settings['trusted_host_patterns'] = ['^portail\.corp\.exemple\.fr$'];
$settings['file_private_path'] = '/var/lib/drupal-prive';
$settings['config_sync_directory'] = '../config/sync';
```

## Administration

| Menu | Usage |
| --- | --- |
| Structure → Types de contenu, Taxonomie, Vues, Blocs, Menus | Modélisation et présentation |
| Apparence | Thèmes (Olivero, Claro) |
| Extensions | Modules (installation par `composer require drupal/<module>` puis activation) |
| Personnes → Rôles, Droits | Comptes et permissions |
| Configuration → Langues, Développement → Performance | Multilingue, cache et agrégation CSS/JS |
| Rapports → Rapport d'état, Messages récents | Santé du site, journal |

<!-- CAPTURE: Rapport d'état Drupal | _assets/drupal-rapport-etat.png -->

## Exploitation

```bash
cd /var/www/portail
vendor/bin/drush status
vendor/bin/drush cr                                   # vider les caches
vendor/bin/drush uli --uri=https://portail.corp.exemple.fr      # lien de connexion à usage unique
composer update "drupal/core-*" --with-all-dependencies && vendor/bin/drush updb -y && vendor/bin/drush cr
vendor/bin/drush cex -y                               # exporter la configuration (Git)
vendor/bin/drush cim -y                               # importer la configuration (déploiement)
vendor/bin/drush sql:dump --gzip --result-file=/srv/sauvegardes/drupal-$(date +%F).sql
vendor/bin/drush pm:security                          # modules avec avis de sécurité
vendor/bin/drush watchdog:show --count=20
```

Cron : *Configuration → Système → Cron* ou `*/15 * * * * www-data cd /var/www/portail && vendor/bin/drush cron`. Sauvegarde : base, `web/sites/default/files`, dossier privé et dépôt Git du projet (avec `composer.lock` et la configuration exportée).

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| « The provided host name is not valid » | `trusted_host_patterns` | Ajouter le nom d'hôte |
| Page blanche après mise à jour | Mises à jour de base non appliquées | `drush updb`, `drush cr`, `watchdog:show` |
| Fichiers non écrits | Droits sur `sites/default/files` | `chown www-data:` |
| Modifications de configuration perdues | Import écrasant les réglages locaux | Exporter (`cex`) avant toute modification en production |

Commandes : [[90-aide-memoire|aide-mémoire]].

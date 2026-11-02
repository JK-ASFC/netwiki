---
title: TYPO3
description: TYPO3 (GPL v2) — CMS d'entreprise en PHP pour grands portails multisites et multilingues : versions LTS, prérequis, installation par Composer (typo3/cms-base-distribution), assistant vendor/bin/typo3 setup, NGINX ou Apache, DDEV, back-office (pages, contenus, gestionnaire d'extensions, maintenance), console typo3 (cache:flush, extension:setup, upgrade:run, language:update), droits, sauvegarde, mise à jour et dépannage.
tags: [typo3, cms, php, composer, entreprise, multisite]
icon: building-2
---

**TYPO3** (GPL v2) est un CMS d'entreprise très présent en Europe (administrations, universités, grands groupes) : arborescence de pages, **multisite** et **multilingue** natifs, espaces de travail et validation, droits fins par groupe de rédacteurs, TypoScript et Fluid pour les gabarits, milliers d'extensions. Les versions **LTS** sont maintenues trois ans (TYPO3 14 LTS actuellement, 13 LTS encore supportée).

Prérequis : PHP 8.2+ (selon la version : `pdo_mysql`/`pdo_pgsql`, `gd` ou ImageMagick/GraphicsMagick, `intl`, `mbstring`, `xml`, `zip`, `opcache`), MySQL 8/MariaDB 10.4+, PostgreSQL ou SQLite, Composer, Apache ou NGINX.

## Installation

```bash
sudo apt install -y nginx mariadb-server composer graphicsmagick php-fpm php-mysql php-gd php-intl php-mbstring php-xml php-zip php-curl php-apcu
sudo mariadb -e "CREATE DATABASE typo3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER 'typo3'@'localhost' IDENTIFIED BY 'MdpTypo32026'; GRANT ALL ON typo3.* TO 'typo3'@'localhost';"
cd /var/www && sudo composer create-project "typo3/cms-base-distribution:^14" portail && cd portail
sudo vendor/bin/typo3 setup            # base, compte administrateur, nom du site (questions interactives)
sudo chown -R www-data:www-data var public/fileadmin public/typo3temp config
```

Racine web : `/var/www/portail/public` ; NGINX : `try_files $uri $uri/ /index.php$is_args$args;`, refus de `/var/`, `*.ts`, `*.typoscript`. Développement local : **DDEV** (`ddev config --project-type=typo3 --docroot=public && ddev start`). Windows et macOS : PHP + Composer (ou DDEV/Docker).

## Back-office

Connexion : `https://portail.corp.exemple.fr/typo3`.

| Module | Usage |
| --- | --- |
| Web → Page | Arborescence et éléments de contenu |
| Web → Liste | Enregistrements (actualités, catégories) |
| Site Management → Sites | Configuration des sites, domaines, langues (`config/sites/*/config.yaml`) |
| Admin Tools → Extensions | Extensions installées (installation par `composer require`) |
| Admin Tools → Maintenance, Upgrade, Environment | Caches, mises à jour de base, diagnostic de l'environnement |
| System → Backend Users | Rédacteurs, groupes, droits par page et par table |

<!-- CAPTURE: Back-office TYPO3, module Page | _assets/typo3-module-page.png -->

## Exploitation

```bash
cd /var/www/portail
vendor/bin/typo3 list
vendor/bin/typo3 cache:flush
vendor/bin/typo3 extension:setup                 # applique schémas et données des extensions
vendor/bin/typo3 language:update                 # traductions (dont le français)
composer update "typo3/*" --with-all-dependencies && vendor/bin/typo3 upgrade:run && vendor/bin/typo3 cache:flush
vendor/bin/typo3 scheduler:run                   # tâches planifiées (cron toutes les 5 minutes)
mysqldump --single-transaction typo3 > /srv/sauvegardes/typo3-$(date +%F).sql
```

Sauvegarde : base, `public/fileadmin` (médias), `config/` et le dépôt Git du projet (`composer.json`, `composer.lock`). Changement de version majeure : passer par les étapes d'**Upgrade Wizard** et vérifier la compatibilité de chaque extension.

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| « Oops, an error occurred! » | Exception masquée en production | `var/log/typo3_*.log`, *Settings → Configuration Presets → Debug* temporairement |
| Back-office inaccessible après mise à jour | Caches, migrations | `cache:flush`, `upgrade:run` |
| Images non générées | GraphicsMagick absent | Installer `graphicsmagick`, *Environment → Image Processing* |

Commandes : [[90-aide-memoire|aide-mémoire]].

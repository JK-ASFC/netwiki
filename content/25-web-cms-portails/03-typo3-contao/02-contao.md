---
title: Contao
description: Contao (LGPL) — CMS PHP orienté accessibilité et sécurité (Symfony) : versions LTS, installation par Contao Manager (contao-manager.phar.php) ou Composer (contao/managed-edition), racine public, outil d'installation /contao/install, console contao-console (contao:user:create, contao:migrate, cache:clear), back-office (structure du site, articles, thèmes, modules, formulaires), sauvegarde, mise à jour et dépannage.
tags: [contao, cms, php, symfony, accessibilité, composer]
icon: layout-panel-top
---

**Contao** (LGPL, basé sur Symfony) est un CMS apprécié pour des sites **accessibles** (conformité WCAG), sûrs et rapides : structure de site par arborescence de pages, articles et éléments de contenu, thèmes et modules, formulaires, droits par utilisateur et groupe, mise en cache HTTP intégrée. Les versions **LTS** sont maintenues longtemps (Contao 5 LTS ; Contao 6 récente).

Prérequis : PHP 8.2+ (`intl`, `gd` ou `imagick`, `pdo_mysql`, `dom`, `zip`), MySQL 8 ou MariaDB 10.3+, Composer ou Contao Manager, la **racine web** pointant sur `public/`.

## Installation

Méthode graphique : déposer `contao-manager.phar.php` (téléchargé depuis le site de Contao) dans le dossier `public/` du futur site, l'ouvrir dans le navigateur, puis choisir la version et les extensions.

Méthode Composer :

```bash
sudo apt install -y nginx mariadb-server composer php-fpm php-mysql php-intl php-gd php-xml php-zip php-mbstring php-curl
sudo mariadb -e "CREATE DATABASE contao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER 'contao'@'localhost' IDENTIFIED BY 'MdpContao2026'; GRANT ALL ON contao.* TO 'contao'@'localhost';"
cd /var/www && sudo composer create-project contao/managed-edition site 5.3
cd site && sudo chown -R www-data:www-data var public/assets public/files files
```

Renseigner la base dans `.env.local` (`DATABASE_URL=mysql://contao:MdpContao2026@127.0.0.1:3306/contao`), puis :

```bash
sudo -u www-data vendor/bin/contao-console contao:migrate --no-interaction
sudo -u www-data vendor/bin/contao-console contao:user:create --username=jk-admin --name="JK" --email=webmaster@corp.exemple.fr --language=fr --admin
```

(ou l'outil d'installation web `https://www.corp.exemple.fr/contao/install`). Back-office : `https://www.corp.exemple.fr/contao`.

| Menu | Usage |
| --- | --- |
| Mise en page → Structure du site | Arborescence, pages racines (un domaine par racine), accès protégé |
| Contenu → Articles, Actualités, Événements | Rédaction |
| Mise en page → Thèmes | Gabarits, modules, mises en page |
| Comptes → Utilisateurs, Groupes, Membres | Droits du back-office et membres du front-office |
| Système → Maintenance, Journal | Caches, index de recherche, journal système |

<!-- CAPTURE: Back-office Contao, structure du site | _assets/contao-structure-site.png -->

## Exploitation

```bash
cd /var/www/site
sudo -u www-data vendor/bin/contao-console cache:clear --env=prod
sudo -u www-data vendor/bin/contao-console contao:migrate --no-interaction       # après mise à jour
sudo composer update && sudo -u www-data vendor/bin/contao-console contao:migrate --no-interaction
sudo -u www-data vendor/bin/contao-console contao:backup:create                 # sauvegarde de la base (var/backups)
```

Sauvegarde : base (`contao:backup:create` ou `mysqldump`), dossier `files/`, `.env.local`, `composer.json` et `composer.lock`.

Commandes : [[90-aide-memoire|aide-mémoire]].

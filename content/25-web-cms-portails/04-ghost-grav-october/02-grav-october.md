---
title: Grav et October CMS
description: Grav (MIT) — CMS PHP sans base de données (fichiers Markdown et YAML, cache, thèmes Twig, extension Admin) : installation par archive ou Composer, bin/grav install, bin/gpm (install, update, selfupgrade), bin/plugin login new-user, passage à Grav 2, sauvegarde ; October CMS (Laravel) — CMS sous licence (gratuite la première année) : composer create-project october/october, php artisan october:install, back-office, mises à jour et commandes artisan.
tags: [grav, october cms, cms, php, flat-file, laravel, markdown]
icon: file-type
---

## Grav

**Grav** (MIT) est un CMS **sans base de données** : chaque page est un dossier contenant un fichier Markdown avec en-tête YAML, ce qui rend le site rapide, facile à versionner dans Git et à sauvegarder. Thèmes en Twig, extensions (*plugins*) par le gestionnaire **GPM**, interface d'administration optionnelle (*Admin*). Grav 2 (PHP 8.3+) succède à la branche 1.7 : le passage de l'une à l'autre demande une migration dédiée (le guide du projet), pas un simple `selfupgrade`.

```bash
sudo apt install -y nginx composer php-fpm php-curl php-gd php-mbstring php-xml php-zip php-intl php-apcu
cd /var/www && sudo composer create-project getgrav/grav site-grav && cd site-grav
sudo bin/grav install                       # dépendances des thèmes et extensions
sudo bin/gpm install admin                  # interface d'administration (optionnelle)
sudo bin/plugin login new-user -u jk-admin -p 'MdpAdmin2026!' -e webmaster@corp.exemple.fr -P b -N "JK" -t "Administrateur du site"
sudo chown -R www-data:www-data /var/www/site-grav
```

Ou télécharger l'archive « Grav + Admin » et l'extraire dans la racine web. NGINX : `try_files $uri $uri/ /index.php?$query_string;` et refus des dossiers `user/accounts`, `user/config`, `cache`, `logs`, `backup`, fichiers `.md`, `.yaml`, `.twig`. Fonctionne aussi sous Windows (IIS, `webserver-configs/web.config` fourni) et macOS (serveur intégré de PHP pour le développement : `php -S localhost:8000 system/router.php`).

Administration : `https://site.corp.exemple.fr/admin` (pages, médias, configuration, extensions, sauvegardes).

```bash
cd /var/www/site-grav
sudo -u www-data bin/gpm index ; sudo -u www-data bin/gpm update ; sudo -u www-data bin/gpm selfupgrade
sudo -u www-data bin/grav clearcache
sudo -u www-data bin/grav backup                # archive ZIP dans backup/
```

<!-- CAPTURE: Interface d'administration Grav, édition d'une page | _assets/grav-admin.png -->

## October CMS

**October CMS** (basé sur **Laravel**) propose un back-office clair, des thèmes Twig et des extensions. Depuis la version 3, c'est un **logiciel sous licence** : chaque nouveau compte reçoit une licence gratuite la première année, puis une licence est nécessaire pour continuer à recevoir les mises à jour et accéder au Marketplace. L'ancienne version 1 libre n'est plus maintenue ; pour un projet libre, préférer [[01-wordpress/01-presentation-installation|WordPress]], [[02-drupal-joomla/01-drupal|Drupal]] ou Grav.

```bash
cd /var/www && sudo composer create-project october/october site-october && cd site-october
sudo php artisan october:install            # clé de licence, base, URL, compte administrateur
sudo chown -R www-data:www-data storage themes plugins
```

Racine web : `public/` (ou la racine du projet selon la configuration) ; tâche planifiée Laravel `* * * * * www-data php /var/www/site-october/artisan schedule:run`. Back-office : `https://site.corp.exemple.fr/admin`. Mises à jour : `php artisan october:update` (ou `composer update` puis `php artisan october:migrate`).

Commandes : [[90-aide-memoire|aide-mémoire]].

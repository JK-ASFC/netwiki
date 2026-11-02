---
title: PrestaShop, WooCommerce, OpenCart et Magento
description: Boutiques en ligne PHP — PrestaShop 9 (OSL 3.0 : très répandu en France ; archive et installateur, Docker prestashop/prestashop avec PS_INSTALL_AUTO, dossier admin renommé, modules, sauvegarde), WooCommerce (GPL : extension WordPress, WP-CLI, Action Scheduler, HPOS), OpenCart 4 (GPL : archive, install/cli_install.php) et Magento Open Source 2.4 (OSL 3.0, Adobe : Composer, OpenSearch, bin/magento setup:install, modes, cron, Mage-OS), prérequis, sécurité (PCI DSS, mises à jour), performances et sauvegarde.
tags: [prestashop, woocommerce, opencart, magento, e-commerce, php]
icon: shopping-cart
---

| | **PrestaShop** | **WooCommerce** | **OpenCart** | **Magento Open Source** |
| --- | --- | --- | --- | --- |
| Licence | OSL 3.0 | GPL v3 | GPL v3 | OSL 3.0 |
| Socle | Symfony, MySQL | Extension [[01-wordpress/01-presentation-installation\|WordPress]] | PHP, MySQL | PHP, MySQL, **OpenSearch** |
| Cible | PME, très présent en France | Sites WordPress existants | Petites boutiques | Gros catalogues, B2B |
| Ressources | Modestes | Modestes | Faibles | Élevées (4 à 8 Go de RAM) |

Points communs : HTTPS partout, paiement par prestataire (aucune donnée de carte stockée localement, réduction du périmètre **PCI DSS**), mises à jour de sécurité rapides du cœur et des modules, sauvegardes testées, CGV et mentions RGPD.

## PrestaShop 9

Prérequis : PHP 8.1 à 8.4 (`intl`, `gd`, `zip`, `curl`, `pdo_mysql`, `mbstring`, `xml`), MySQL 8 ou MariaDB.

```bash
docker network create boutique
docker run -d --name ps-db --network boutique -e MYSQL_ROOT_PASSWORD=MdpRootMysql2026 -e MYSQL_DATABASE=prestashop -v ps-db:/var/lib/mysql mysql:8.4
docker run -d --name prestashop --network boutique -p 127.0.0.1:8080:80 \
  -e DB_SERVER=ps-db -e DB_USER=root -e DB_PASSWD=MdpRootMysql2026 -e DB_NAME=prestashop \
  -e PS_INSTALL_AUTO=1 -e PS_DOMAIN=boutique.corp.exemple.fr -e PS_LANGUAGE=fr -e PS_COUNTRY=FR -e PS_ENABLE_SSL=1 \
  -e PS_FOLDER_ADMIN=gestion-7k3q -e ADMIN_MAIL=boutique@corp.exemple.fr -e ADMIN_PASSWD='MdpAdmin2026!' \
  -v ps-data:/var/www/html prestashop/prestashop:9
```

Sans Docker : extraire l'archive officielle dans la racine web, ouvrir le site pour l'**assistant d'installation**, puis **supprimer le dossier `install/`** ; le dossier d'administration reçoit un nom aléatoire (le noter). Sous Windows : WAMP ou IIS + PHP ; macOS : PHP de Homebrew ou Docker.

Back-office : `https://boutique.corp.exemple.fr/<dossier-admin>` — *Catalogue*, *Commandes*, *Clients*, *Modules* (paiement, livraison, marketing), *Paramètres avancés* (performances : cache Smarty, CCC, OPcache, mode maintenance ; *Webservice* pour les intégrations). Tâches planifiées : module *Cron tasks manager* ou cron système.

<!-- CAPTURE: Back-office PrestaShop, liste des commandes | _assets/prestashop-commandes.png -->

## WooCommerce

```bash
cd /var/www/wordpress
sudo -u www-data wp plugin install woocommerce --activate
sudo -u www-data wp wc --help                               # commandes WooCommerce de WP-CLI (produits, commandes, réglages)
sudo -u www-data wp action-scheduler run                    # traite les tâches en attente (Action Scheduler)
```

L'assistant de configuration (adresse, devise, paiements, livraison, taxes) s'ouvre ensuite dans *WooCommerce → Accueil*. Activer le stockage des commandes **HPOS** (*WooCommerce → Réglages → Avancé → Fonctionnalités*), remplacer WP-Cron par un cron système (voir [[01-wordpress/02-exploitation-securite|exploitation de WordPress]]), et dimensionner MariaDB et le cache objet Redis selon le volume de commandes.

## OpenCart 4

```bash
sudo unzip opencart-4.1.0.4.zip -d /tmp/opencart && sudo cp -r /tmp/opencart/upload/* /var/www/opencart/
cd /var/www/opencart && sudo cp config-dist.php config.php && sudo cp admin/config-dist.php admin/config.php
sudo chown -R www-data:www-data /var/www/opencart
sudo -u www-data php install/cli_install.php install --username admin-boutique --password 'MdpAdmin2026!' --email boutique@corp.exemple.fr \
  --http_server https://boutique.corp.exemple.fr/ --db_driver mysqli --db_hostname localhost --db_username opencart --db_password MdpOpencart2026 --db_database opencart --db_port 3306 --db_prefix oc_
sudo rm -rf /var/www/opencart/install
```

(Ou l'assistant web.) Déplacer le dossier `storage/` hors de la racine web comme le propose l'administration, et renommer le dossier `admin/`.

## Magento Open Source 2.4

Prérequis : PHP 8.3/8.4, MySQL 8 ou MariaDB, **OpenSearch** (moteur de recherche obligatoire), Redis, Composer, clés d'accès au dépôt `repo.magento.com` (compte Adobe Commerce Marketplace gratuit). **Mage-OS** est une distribution communautaire compatible qui ne demande pas ces clés.

```bash
composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition /var/www/magento
cd /var/www/magento
bin/magento setup:install --base-url=https://boutique.corp.exemple.fr/ --db-host=localhost --db-name=magento --db-user=magento --db-password=MdpMagento2026 \
  --admin-firstname=JK --admin-lastname=Admin --admin-email=boutique@corp.exemple.fr --admin-user=admin-boutique --admin-password='MdpAdmin2026!' \
  --language=fr_FR --currency=EUR --timezone=Europe/Paris --use-rewrites=1 \
  --search-engine=opensearch --opensearch-host=localhost --opensearch-port=9200
bin/magento deploy:mode:set production
bin/magento cron:install
bin/magento cache:flush
```

Le chemin du back-office (`/admin_xxxx`) est affiché en fin d'installation (`bin/magento info:adminuri`). Activer l'**authentification à deux facteurs** (module intégré), Redis pour le cache et les sessions, Varnish pour le cache de pages.

## Sauvegarde

Base de données **et** fichiers (images produits, modules, configuration : `app/config/parameters.php` pour PrestaShop, `app/etc/env.php` pour Magento, `config.php` pour OpenCart), avant chaque mise à jour du cœur ou d'un module.

Commandes : [[90-aide-memoire|aide-mémoire]].

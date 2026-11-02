---
title: E-commerce — aide-mémoire des commandes
description: Commandes PrestaShop (Docker, cache), WooCommerce (WP-CLI wc, action-scheduler), OpenCart (cli_install.php) et Magento (setup:install, setup:upgrade, deploy:mode:set, indexer:reindex, cache:flush, cron:run, info:adminuri, maintenance) avec exemples.
tags: [aide-mémoire, prestashop, woocommerce, opencart, magento]
icon: terminal
---

Explications : [[01-prestashop-woocommerce-opencart-magento|PrestaShop, WooCommerce, OpenCart, Magento]].

```bash
docker logs -f prestashop ; docker exec -it prestashop rm -rf /var/www/html/var/cache/prod
sudo -u www-data wp plugin install woocommerce --activate ; sudo -u www-data wp wc product list --user=1
sudo -u www-data wp action-scheduler run
sudo -u www-data php install/cli_install.php install --username admin-boutique --password 'MdpAdmin2026!' --email boutique@corp.exemple.fr --http_server https://boutique.corp.exemple.fr/ --db_driver mysqli --db_hostname localhost --db_username opencart --db_password MdpOpencart2026 --db_database opencart --db_port 3306 --db_prefix oc_
cd /var/www/magento
bin/magento maintenance:enable ; composer update ; bin/magento setup:upgrade ; bin/magento setup:di:compile ; bin/magento setup:static-content:deploy fr_FR ; bin/magento maintenance:disable
bin/magento deploy:mode:show ; bin/magento indexer:reindex ; bin/magento cache:flush ; bin/magento cron:run
bin/magento info:adminuri ; bin/magento admin:user:create --admin-user=gestion --admin-password='MdpTemporaire2026!' --admin-email=gestion@corp.exemple.fr --admin-firstname=G --admin-lastname=Estion
```

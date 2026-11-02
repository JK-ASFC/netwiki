---
title: Drupal et Joomla — aide-mémoire des commandes
description: Commandes Drupal (composer create-project, drush site:install, status, cr, uli, updb, cex, cim, sql:dump, pm:security, cron) et Joomla (installation/joomla.php install, cli/joomla.php core:update, extension:install, user:add, user:reset-password, cache:clean, site:down, scheduler:run) avec exemples.
tags: [aide-mémoire, drupal, drush, joomla]
icon: terminal
---

Explications : [[01-drupal|Drupal]] · [[02-joomla|Joomla]].

## Drupal (depuis la racine du projet)

```bash
composer create-project drupal/recommended-project portail && cd portail && composer require drush/drush
vendor/bin/drush site:install standard --db-url=mysql://drupal:MdpDrupal2026@localhost/drupal --site-name="Portail" --account-name=jk-admin --locale=fr -y
vendor/bin/drush status ; vendor/bin/drush cr ; vendor/bin/drush uli
composer require drupal/pathauto && vendor/bin/drush en pathauto -y
composer update "drupal/core-*" --with-all-dependencies && vendor/bin/drush updb -y
vendor/bin/drush cex -y ; vendor/bin/drush cim -y
vendor/bin/drush sql:dump --gzip --result-file=/srv/sauvegardes/drupal-$(date +%F).sql
vendor/bin/drush pm:security ; vendor/bin/drush watchdog:show --count=20 ; vendor/bin/drush cron
vendor/bin/drush user:password jk-admin 'NouveauMdp2026!'
```

## Joomla (depuis la racine du site)

```bash
sudo -u www-data php installation/joomla.php install
sudo -u www-data php cli/joomla.php list
sudo -u www-data php cli/joomla.php core:update:check ; sudo -u www-data php cli/joomla.php core:update
sudo -u www-data php cli/joomla.php extension:install --path=/tmp/extension.zip
sudo -u www-data php cli/joomla.php extension:list
sudo -u www-data php cli/joomla.php user:add --username=redacteur --name="Rédacteur" --email=redacteur@corp.exemple.fr --usergroup=Author --password='MdpTemporaire2026!'
sudo -u www-data php cli/joomla.php user:reset-password --username=jk-admin
sudo -u www-data php cli/joomla.php cache:clean ; sudo -u www-data php cli/joomla.php site:down
sudo -u www-data php cli/joomla.php scheduler:run --all
```

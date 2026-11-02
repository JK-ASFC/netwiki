---
title: WordPress — aide-mémoire WP-CLI
description: Commandes WP-CLI avec exemples — installation (core download, config create, core install), mises à jour (core, plugins, thèmes, langues), utilisateurs, extensions, options, base de données (export, import, search-replace, optimize), cache et cron, multisite, maintenance, Docker.
tags: [aide-mémoire, wordpress, wp-cli, classicpress]
icon: terminal
---

Explications : [[01-presentation-installation|installation]] · [[02-exploitation-securite|exploitation et sécurité]]. Toutes les commandes se lancent depuis la racine du site avec l'utilisateur du serveur web (`sudo -u www-data wp …`).

```bash
wp --info ; wp core version ; wp core verify-checksums
wp core download --locale=fr_FR
wp config create --dbname=wordpress --dbuser=wp --dbpass=MdpWordpress2026
wp core install --url=https://site.corp.exemple.fr --title="Site" --admin_user=jk-admin --admin_password='MdpAdmin2026!' --admin_email=webmaster@corp.exemple.fr
wp core update && wp core update-db
wp plugin list --update=available ; wp plugin update --all ; wp plugin install wordfence --activate
wp plugin deactivate --all ; wp plugin activate woocommerce
wp theme list ; wp theme update --all ; wp theme delete twentytwentyfour
wp language core install fr_FR --activate ; wp language core update
wp user list --role=administrator ; wp user create redacteur redacteur@corp.exemple.fr --role=editor
wp user update jk-admin --user_pass='NouveauMdp2026!'
wp option get siteurl ; wp option update blogdescription "Intranet de l'entreprise"
wp db export /srv/sauvegardes/wordpress-$(date +%F).sql ; wp db import sauvegarde.sql ; wp db optimize
wp search-replace 'http://site.corp.exemple.fr' 'https://site.corp.exemple.fr' --all-tables
wp cache flush ; wp rewrite flush ; wp transient delete --expired
wp cron event list ; wp cron event run --due-now
wp maintenance-mode activate ; wp maintenance-mode deactivate
wp config shuffle-salts
wp site list                                    # multisite
docker compose exec wordpress bash -c 'curl -sO https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && php wp-cli.phar --allow-root core version'
```

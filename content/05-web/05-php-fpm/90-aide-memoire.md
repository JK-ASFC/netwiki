---
title: PHP-FPM — aide-mémoire des commandes
description: Commandes PHP et PHP-FPM avec exemples — versions et modules (php -v, -m, -i, --ini), test de configuration (php-fpm -t), service, pools (utilisateur, socket, pm dynamic/ondemand, limites), page de statut et ping, journaux lents (slowlog), OPcache, extensions (apt, pecl), Composer, réglages php.ini de production, intégration Nginx/Apache, plusieurs versions en parallèle.
tags: [aide-mémoire, php, php-fpm, opcache, composer, pools]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation-pools|PHP-FPM]]. Exemples avec PHP 8.3 (Debian/Ubuntu : `/etc/php/8.3/`).

## Versions, modules, configuration

```bash
php -v
php -m                                    # modules chargés (CLI)
php -i | grep -E "memory_limit|upload_max_filesize|opcache.enable"
php --ini                                 # fichiers ini chargés
php -r 'echo PHP_VERSION, PHP_EOL;'
sudo php-fpm8.3 -t                        # tester la configuration FPM
sudo php-fpm8.3 -tt                       # tester et afficher toute la configuration
sudo systemctl reload php8.3-fpm
sudo apt install php8.3-{cli,fpm,mysql,pgsql,curl,mbstring,xml,zip,intl,gd,opcache,redis}
sudo phpenmod -v 8.3 redis && sudo phpdismod -v 8.3 xdebug
```

## Pool type

```ini
; /etc/php/8.3/fpm/pool.d/intranet.conf
[intranet]
user = intranet
group = intranet
listen = /run/php/php8.3-fpm-intranet.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660
pm = dynamic
pm.max_children = 20
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6
pm.max_requests = 500
pm.status_path = /fpm-status
ping.path = /fpm-ping
request_terminate_timeout = 60s
request_slowlog_timeout = 5s
slowlog = /var/log/php8.3-fpm-intranet-slow.log
php_admin_value[open_basedir] = /var/www/intranet:/tmp
php_admin_value[disable_functions] = exec,passthru,shell_exec,system,proc_open,popen
php_admin_flag[expose_php] = off
```

Calcul de `pm.max_children` ≈ mémoire disponible pour PHP ÷ mémoire moyenne d'un processus :

```bash
ps -ylC php-fpm8.3 --sort:rss | awk 'NR>1 {s+=$8; n++} END {print "moyenne :", s/n/1024, "Mo"}'
```

## Statut et santé

```nginx
location ~ ^/(fpm-status|fpm-ping)$ {
    allow 127.0.0.1;
    deny all;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $fastcgi_script_name;
    fastcgi_pass unix:/run/php/php8.3-fpm-intranet.sock;
}
```

```bash
curl -s "http://127.0.0.1/fpm-status?full" | head -30
curl -s http://127.0.0.1/fpm-ping
# Interroger le socket directement (paquet libfcgi-bin)
SCRIPT_NAME=/fpm-status SCRIPT_FILENAME=/fpm-status REQUEST_METHOD=GET cgi-fcgi -bind -connect /run/php/php8.3-fpm-intranet.sock
sudo tail -f /var/log/php8.3-fpm.log /var/log/php8.3-fpm-intranet-slow.log
```

## Réglages de production (php.ini)

```ini
expose_php = Off
display_errors = Off
log_errors = On
memory_limit = 256M
upload_max_filesize = 50M
post_max_size = 50M
max_execution_time = 60
session.cookie_secure = 1
session.cookie_httponly = 1
session.cookie_samesite = Lax
opcache.enable = 1
opcache.memory_consumption = 256
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 1
opcache.revalidate_freq = 60
```

## Composer et extensions PECL

```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && php composer-setup.php --install-dir=/usr/local/bin --filename=composer && rm composer-setup.php
composer install --no-dev --optimize-autoloader
composer audit                              # vulnérabilités des dépendances
composer outdated --direct
sudo pecl install apcu && echo "extension=apcu.so" | sudo tee /etc/php/8.3/mods-available/apcu.ini && sudo phpenmod apcu
```

## Plusieurs versions

```bash
sudo update-alternatives --config php       # version de la CLI
ls /run/php/                                 # un socket par version et par pool
# Nginx : choisir la version par site via fastcgi_pass unix:/run/php/php8.2-fpm.sock;
```

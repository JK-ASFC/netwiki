---
title: PHP-FPM et applications
description: Exécuter PHP avec PHP-FPM (mod_proxy_fcgi), pools par site et isolation, réglages de PHP et d'OPcache, mod_php hérité, applications Python (mod_wsgi), CGI, et exemples de configuration WordPress, Laravel et Nextcloud.
tags: [apache, php, php-fpm, fastcgi, mod_wsgi, python, wordpress, laravel]
icon: code
---

## PHP-FPM avec Apache (recommandé)

**PHP-FPM** (*FastCGI Process Manager*) exécute PHP dans des processus séparés, organisés en **pools**. Apache (MPM event) transmet les requêtes `.php` via FastCGI.

```bash
# Debian / Ubuntu
sudo apt install php8.2-fpm php8.2-{mysql,pgsql,intl,mbstring,xml,curl,zip,gd,opcache}
sudo a2enmod proxy_fcgi setenvif
sudo a2enconf php8.2-fpm          # gestionnaire global .php → socket du pool « www »
sudo systemctl reload apache2

# RHEL / Alma
sudo dnf install php-fpm php-mysqlnd php-intl php-mbstring php-xml php-opcache
sudo systemctl enable --now php-fpm   # /etc/httpd/conf.d/php.conf relie déjà .php au socket
```

### Un pool par site (isolation)

```ini /etc/php/8.2/fpm/pool.d/intranet.conf
[intranet]
user = intranet
group = intranet
listen = /run/php/php8.2-fpm-intranet.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660

pm = dynamic
pm.max_children = 20
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6
pm.max_requests = 1000

; Sécurité et diagnostic
php_admin_value[open_basedir] = /srv/www/intranet:/tmp
php_admin_value[upload_tmp_dir] = /srv/www/intranet/tmp
php_admin_value[error_log] = /var/log/php/intranet-error.log
php_admin_flag[log_errors] = on
php_admin_value[disable_functions] = exec,passthru,shell_exec,system,proc_open,popen
request_slowlog_timeout = 5s
slowlog = /var/log/php/intranet-slow.log
pm.status_path = /fpm-status
```

```bash
sudo useradd -r -s /usr/sbin/nologin -d /srv/www/intranet intranet
sudo mkdir -p /var/log/php /srv/www/intranet/tmp && sudo chown intranet: /srv/www/intranet/tmp
sudo php-fpm8.2 -t && sudo systemctl reload php8.2-fpm
```

### Relier le vhost au pool

```apache
<VirtualHost *:443>
    ServerName intranet.exemple.fr
    DocumentRoot /srv/www/intranet/public

    <FilesMatch "\.php$">
        SetHandler "proxy:unix:/run/php/php8.2-fpm-intranet.sock|fcgi://localhost"
    </FilesMatch>

    # Pool distant (autre serveur) :
    # SetHandler "proxy:fcgi://10.0.20.30:9000"

    <Directory /srv/www/intranet/public>
        AllowOverride None
        Require all granted
        DirectoryIndex index.php
    </Directory>

    <Location /fpm-status>
        SetHandler "proxy:unix:/run/php/php8.2-fpm-intranet.sock|fcgi://localhost"
        Require ip 127.0.0.1 10.0.10.0/24
    </Location>
</VirtualHost>
```

> [!TIP]
> Dimensionnement : `pm.max_children` ≈ mémoire disponible pour PHP ÷ mémoire moyenne d'un processus (`ps -o rss -C php-fpm8.2`). Un message `server reached pm.max_children setting` dans le journal FPM indique un pool trop petit (ou des requêtes trop lentes).

### Plusieurs versions de PHP

Chaque version a son propre service (`php8.1-fpm`, `php8.3-fpm`) et ses sockets : un site peut rester en 8.1 pendant que les autres passent en 8.3, simplement en changeant le `SetHandler`. Dépôts : `ppa:ondrej/php` (Ubuntu), `packages.sury.org` (Debian), Remi (RHEL).

## Réglages PHP essentiels

```ini /etc/php/8.2/fpm/conf.d/99-production.ini
expose_php = Off
display_errors = Off
log_errors = On
memory_limit = 256M
max_execution_time = 60
upload_max_filesize = 64M
post_max_size = 64M
date.timezone = Europe/Paris
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1

opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 1
opcache.revalidate_freq = 2
```

## mod_php (hérité)

`libapache2-mod-php` intègre PHP **dans les processus Apache** : simple, mais impose le MPM prefork (pas de HTTP/2), consomme plus de mémoire et exécute tous les sites sous le même utilisateur. À réserver à d'anciennes configurations.

## Configurations d'applications courantes

### WordPress

```apache
<Directory /srv/www/blog>
    AllowOverride FileInfo Options     # WordPress écrit ses règles de permaliens dans .htaccess
    Require all granted
</Directory>
<Directory /srv/www/blog/wp-content/uploads>
    <FilesMatch "\.php$">
        Require all denied             # jamais d'exécution PHP dans les envois
    </FilesMatch>
</Directory>
<Files xmlrpc.php>
    Require all denied
</Files>
```

### Laravel / Symfony

```apache
DocumentRoot /srv/www/app/public        # seul le dossier public est exposé
<Directory /srv/www/app/public>
    AllowOverride None
    Require all granted
    FallbackResource /index.php         # remplace les règles de réécriture du contrôleur frontal
</Directory>
```

### Nextcloud

```apache
<Directory /var/www/nextcloud/>
    Require all granted
    AllowOverride All
    Options FollowSymLinks MultiViews
    <IfModule mod_dav.c>
        Dav off
    </IfModule>
</Directory>
Header always set Strict-Transport-Security "max-age=15552000; includeSubDomains"
```

## Python : mod_wsgi

```bash
sudo apt install libapache2-mod-wsgi-py3
```

```apache
<VirtualHost *:443>
    ServerName app.exemple.fr
    WSGIDaemonProcess app user=app group=app processes=2 threads=8 python-home=/srv/app/venv python-path=/srv/app
    WSGIProcessGroup app
    WSGIApplicationGroup %{GLOBAL}
    WSGIScriptAlias / /srv/app/app/wsgi.py

    <Directory /srv/app/app>
        <Files wsgi.py>
            Require all granted
        </Files>
    </Directory>

    Alias /static /srv/app/static
    <Directory /srv/app/static>
        Require all granted
    </Directory>
</VirtualHost>
```

Alternative courante : exécuter l'application avec **Gunicorn/Uvicorn** et la publier par [[06-reverse-proxy-repartition|reverse proxy]].

## CGI

```bash
sudo a2enmod cgid
```

```apache
ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/
<Directory /usr/lib/cgi-bin>
    Options +ExecCGI
    Require ip 10.0.0.0/8
</Directory>
```

## Diagnostic

| Symptôme | Cause probable |
| --- | --- |
| Le code PHP s'affiche ou se télécharge | Gestionnaire non appliqué (`SetHandler`/`a2enconf php-fpm` manquant), `proxy_fcgi` non chargé |
| `503 Service Unavailable` + `AH01079: failed to make connection to backend` | Pool FPM arrêté, mauvais chemin de socket, droits sur le socket (`listen.owner`) |
| `Primary script unknown` (journal FPM) | Fichier introuvable pour FPM : `DocumentRoot`, `open_basedir`, chroot |
| `AH01071: Got error 'PHP message: …'` | Erreur PHP relayée dans le journal Apache |
| Lenteur | `slowlog` FPM, `pm.max_children` atteint, OPcache désactivé |

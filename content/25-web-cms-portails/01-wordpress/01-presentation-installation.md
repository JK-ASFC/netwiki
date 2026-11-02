---
title: Présentation et installation
description: WordPress (GPL v2) — CMS PHP le plus répandu (sites, blogs, intranets, e-commerce avec WooCommerce) et ClassicPress (dérivé sans l'éditeur de blocs) : architecture (PHP, MySQL/MariaDB, serveur web), prérequis, installation sous Debian/Ubuntu et RHEL avec WP-CLI ou par archive, NGINX et PHP-FPM, Windows (IIS) et macOS, Docker (image officielle wordpress), multisite, premiers réglages.
tags: [wordpress, classicpress, cms, php, mariadb, wp-cli, docker]
icon: download
---

**WordPress** (GPL v2) fait fonctionner une très grande part des sites web : thèmes, **extensions** (plus de 60 000), éditeur de blocs (*Gutenberg*), gestion des médias et des rôles, API REST, **multisite**. Il sert aux sites vitrines, blogs, intranets et, avec WooCommerce, à la vente en ligne. **ClassicPress** est un dérivé (*fork*) qui conserve l'éditeur classique, plus léger, compatible avec la plupart des extensions et avec WP-CLI.

Prérequis : PHP 8.2 ou plus récent (`mysqli`, `curl`, `gd` ou `imagick`, `intl`, `mbstring`, `xml`, `zip`), MySQL 8 ou MariaDB 10.6+, Apache ou NGINX, HTTPS.

## Debian / Ubuntu avec WP-CLI

```bash
sudo apt install -y nginx mariadb-server php-fpm php-mysql php-curl php-gd php-intl php-mbstring php-xml php-zip php-imagick
sudo mariadb -e "CREATE DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER 'wp'@'localhost' IDENTIFIED BY 'MdpWordpress2026'; GRANT ALL ON wordpress.* TO 'wp'@'localhost';"
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar && sudo mv wp-cli.phar /usr/local/bin/wp
sudo mkdir -p /var/www/wordpress && sudo chown www-data:www-data /var/www/wordpress
cd /var/www/wordpress
sudo -u www-data wp core download --locale=fr_FR
sudo -u www-data wp config create --dbname=wordpress --dbuser=wp --dbpass=MdpWordpress2026 --dbhost=localhost
sudo -u www-data wp core install --url=https://site.corp.exemple.fr --title="Site de l'entreprise" --admin_user=jk-admin --admin_password='MdpAdmin2026!' --admin_email=webmaster@corp.exemple.fr
```

Bloc NGINX (avec PHP-FPM) :

```nginx
server {
  listen 443 ssl http2;
  server_name site.corp.exemple.fr;
  root /var/www/wordpress;
  index index.php;
  client_max_body_size 64M;
  ssl_certificate     /etc/letsencrypt/live/site.corp.exemple.fr/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/site.corp.exemple.fr/privkey.pem;
  location / { try_files $uri $uri/ /index.php?$args; }
  location ~ \.php$ { include snippets/fastcgi-php.conf; fastcgi_pass unix:/run/php/php-fpm.sock; }
  location ~* /(?:uploads|files)/.*\.php$ { deny all; }
  location = /xmlrpc.php { deny all; }
}
```

RHEL / Rocky : `dnf install nginx mariadb-server php-fpm php-mysqlnd php-gd php-intl php-mbstring php-xml php-pecl-zip`, utilisateur `nginx` ou `apache`, SELinux : `semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/wordpress/wp-content(/.*)?"` puis `restorecon -Rv /var/www/wordpress`.

## Windows et macOS

- **Windows** : IIS + PHP (FastCGI) + MySQL/MariaDB, module *URL Rewrite* (fichier `web.config` pour les permaliens), ou une pile WAMP/XAMPP pour un poste de développement.
- **macOS** : PHP et MariaDB de Homebrew (`brew install php mariadb`), ou des outils de développement local (Local, MAMP).
- Partout : **Docker** (ci-dessous).

## Docker (image officielle)

```yaml
services:
  wordpress:
    image: wordpress:php8.3-apache
    ports: ["127.0.0.1:8080:80"]
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wp
      WORDPRESS_DB_PASSWORD: MdpWordpress2026
      WORDPRESS_DB_NAME: wordpress
    volumes: ["wp-data:/var/www/html"]
    depends_on: [db]
  db:
    image: mariadb:11
    environment: { MARIADB_DATABASE: wordpress, MARIADB_USER: wp, MARIADB_PASSWORD: MdpWordpress2026, MARIADB_RANDOM_ROOT_PASSWORD: "1" }
    volumes: ["db-data:/var/lib/mysql"]
volumes: { wp-data: {}, db-data: {} }
```

Derrière un reverse proxy TLS, transmettre `X-Forwarded-Proto` et ajouter dans `wp-config.php` : `if (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') { $_SERVER['HTTPS'] = 'on'; }`.

## ClassicPress

Mêmes prérequis et même procédure : télécharger l'archive de la dernière version (dépôt `ClassicPress/ClassicPress-release`) au lieu de `wp core download`, puis l'assistant web ou `wp core install`. Migration d'un WordPress existant : extension de migration fournie par le projet (vérifier la compatibilité des extensions qui dépendent de l'éditeur de blocs).

## Premiers réglages

1. *Réglages → Général* : langue, fuseau horaire ; *Permaliens* : « Titre de la publication ».
2. *Utilisateurs* : comptes nominatifs, rôles minimaux (Éditeur, Auteur), pas de compte nommé `admin`.
3. Désactiver les commentaires si inutiles, supprimer thèmes et extensions inutilisés.
4. Suite : [[02-exploitation-securite|exploitation et sécurité]].

<!-- CAPTURE: Tableau de bord d'administration WordPress | _assets/wordpress-tableau-de-bord.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].

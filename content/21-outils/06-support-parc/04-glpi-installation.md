---
title: GLPI — installation et configuration
description: GLPI, logiciel libre de gestion de parc et de services informatiques (ITSM) — fonctions, prérequis (PHP, MariaDB/MySQL, serveur web), installation (archive, répertoires hors racine web, configuration nginx ou Apache vers public/), assistant, comptes par défaut à sécuriser, entités, authentification LDAP/Active Directory et SSO, collecteur de courriels, tâches automatiques (cron), notifications, plugins, sécurité, sauvegarde et mises à jour.
tags: [glpi, itsm, gestion de parc, helpdesk, php, mariadb, ldap, installation]
icon: ticket
---

**GLPI** (Teclib', GPL) est la solution libre de référence pour la **gestion de parc** (inventaire, CMDB, contrats, licences) et l'**assistance** (tickets, problèmes, changements, catalogue de services, SLA). Très répandu dans les collectivités, l'enseignement et les entreprises françaises. Teclib' propose aussi une offre hébergée (GLPI Network Cloud) et du support.

## Prérequis

| Composant | Version (GLPI 10.x / 11) |
| --- | --- |
| PHP | Version supportée par la version de GLPI (8.x) avec extensions `ctype`, `curl`, `gd`, `intl`, `mysqli`, `zlib`, `bcmath`, `ldap`, `opcache`, `sodium`, `zip`, `bz2`, `exif` |
| Base | MariaDB ou MySQL (version récente, `utf8mb4`) |
| Serveur web | nginx + PHP-FPM ou Apache |

## Installation

```bash
sudo apt install nginx mariadb-server php-fpm php-{mysql,curl,gd,intl,xml,mbstring,zip,bz2,ldap,bcmath,opcache,apcu}
sudo mysql -e "CREATE DATABASE glpi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER 'glpi'@'localhost' IDENTIFIED BY 'MotDePasseBdd'; GRANT ALL ON glpi.* TO 'glpi'@'localhost';
  GRANT SELECT ON mysql.time_zone_name TO 'glpi'@'localhost';"
sudo mysql_tzinfo_to_sql /usr/share/zoneinfo | sudo mysql mysql      # fuseaux horaires (recommandé)

VERSION=10.0.20   # dernière version stable, à vérifier sur github.com/glpi-project/glpi
wget https://github.com/glpi-project/glpi/releases/download/${VERSION}/glpi-${VERSION}.tgz
sudo tar xzf glpi-${VERSION}.tgz -C /var/www/
```

Placez **configuration**, **données** et **journaux** hors de l'arborescence publiée :

```php /var/www/glpi/inc/downstream.php
<?php
define('GLPI_CONFIG_DIR', '/etc/glpi/');
if (file_exists(GLPI_CONFIG_DIR . '/local_define.php')) {
    require_once GLPI_CONFIG_DIR . '/local_define.php';
}
```

```php /etc/glpi/local_define.php
<?php
define('GLPI_VAR_DIR', '/var/lib/glpi');
define('GLPI_LOG_DIR', '/var/log/glpi');
```

```bash
sudo mkdir -p /etc/glpi /var/lib/glpi /var/log/glpi
sudo mv /var/www/glpi/files/* /var/lib/glpi/
sudo chown -R www-data: /etc/glpi /var/lib/glpi /var/log/glpi
sudo chown -R root: /var/www/glpi && sudo chown www-data: /var/www/glpi/marketplace
```

```nginx /etc/nginx/sites-available/glpi
server {
    listen 443 ssl;
    server_name glpi.corp.exemple.fr;
    ssl_certificate     /etc/ssl/certs/glpi.crt;
    ssl_certificate_key /etc/ssl/private/glpi.key;
    root /var/www/glpi/public;          # GLPI 10.0.7+ : seul le dossier public est exposé

    location / { try_files $uri /index.php$is_args$args; }
    location ~ ^/index\.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

Puis l'assistant web (`https://glpi.corp.exemple.fr`) ou la console :

```bash
sudo -u www-data php /var/www/glpi/bin/console db:install --db-host=localhost --db-name=glpi --db-user=glpi --db-password='MotDePasseBdd' --default-language=fr_FR
sudo rm /var/www/glpi/install/install.php
```

> [!WARNING]
> Changez **immédiatement** les mots de passe des comptes par défaut `glpi`, `tech`, `normal`, `post-only` (mot de passe identique au nom) ou désactivez-les. Des instances GLPI sont régulièrement compromises par ces comptes et par des versions non mises à jour.

## Configuration

| Élément | Où |
| --- | --- |
| **Entités** | *Administration → Entités* : sites, filiales, clients — cloisonnement des données |
| Profils | *Administration → Profils* : Self-Service, Technicien, Superviseur, Admin |
| **Annuaire LDAP** | *Configuration → Authentification → Annuaires LDAP* : serveur LDAPS, base, filtre, champ de connexion `samaccountname`, synchronisation des champs, règles d'affectation d'entité/profil selon les groupes |
| SSO | SAML/OIDC (plugin ou fonction selon la version), authentification HTTP par le reverse proxy |
| **Collecteur de courriels** | *Configuration → Collecteurs* : boîte IMAP de support → création de tickets |
| Notifications | *Configuration → Notifications* : courriels sortants (SMTP), modèles |
| **Actions automatiques** | Exécutées par **cron** (pas par les visites) : `*/2 * * * * www-data php /var/www/glpi/front/cron.php` |
| Plugins | *Configuration → Plugins* / Marketplace (inventaire étendu, formulaires, champs supplémentaires) |

## Sauvegarde et mises à jour

```bash
mysqldump --single-transaction glpi > /srv/sauvegardes/glpi-$(date +%F).sql
tar czf /srv/sauvegardes/glpi-fichiers-$(date +%F).tgz /etc/glpi /var/lib/glpi
```

Mise à jour : sauvegarde, remplacement des fichiers de l'application (conserver `inc/downstream.php`), puis `php bin/console db:update` ; vérifier la compatibilité des plugins. Abonnez-vous aux avis de sécurité du projet.

Suite : [[05-glpi-inventaire-assistance|inventaire et assistance]].

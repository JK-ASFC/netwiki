---
title: Joomla
description: Joomla (GPL v2) — CMS PHP pour sites institutionnels, associations et collectivités : articles, catégories, menus, modules, multilingue, contrôle d'accès ACL ; prérequis (PHP 8.3+, MySQL/MariaDB ou PostgreSQL), installation par archive et assistant web ou par CLI (installation/joomla.php install), Windows et macOS, Docker (image officielle joomla), console cli/joomla.php (user:add, core:update, extension:install, cache:clean, site:down), planificateur de tâches, sécurité, sauvegarde et dépannage.
tags: [joomla, cms, php, mariadb, cli, docker]
icon: blocks
---

**Joomla** (GPL v2) est un CMS PHP complet sans extension : articles et catégories, menus, modules et positions, **multilingue** natif, **ACL** (groupes et niveaux d'accès), formulaires de contact, recherche intelligente, planificateur de tâches, mises à jour en un clic. Joomla 6 est la version actuelle.

Prérequis : PHP 8.3+ (`mysqli`/`pdo_mysql` ou `pgsql`, `json`, `xml`, `zip`, `gd`, `intl`), MySQL 8.0.13+ / MariaDB 10.4+ ou PostgreSQL 12+, Apache, NGINX ou IIS.

## Installation

```bash
sudo apt install -y apache2 mariadb-server unzip php libapache2-mod-php php-mysql php-xml php-zip php-gd php-intl php-mbstring php-curl
sudo mariadb -e "CREATE DATABASE joomla CHARACTER SET utf8mb4; CREATE USER 'joomla'@'localhost' IDENTIFIED BY 'MdpJoomla2026'; GRANT ALL ON joomla.* TO 'joomla'@'localhost';"
V=6.2.0
wget https://github.com/joomla/joomla-cms/releases/download/$V/Joomla_$V-Stable-Full_Package.zip
sudo mkdir -p /var/www/joomla && sudo unzip Joomla_$V-Stable-Full_Package.zip -d /var/www/joomla && sudo chown -R www-data:www-data /var/www/joomla
cd /var/www/joomla && sudo -u www-data php installation/joomla.php install     # assistant en ligne de commande (ou https://cms.corp.exemple.fr/installation/)
```

L'assistant (web ou CLI) demande nom du site, compte super utilisateur, base de données et préfixe des tables ; le dossier `installation/` est supprimé à la fin. Activer ensuite les **URL simplifiées** (*Système → Configuration globale → Site*) et renommer `htaccess.txt` en `.htaccess` (Apache). Windows : IIS (`web.config.txt` → `web.config`) ou WAMP ; macOS : PHP de Homebrew.

Docker (image officielle) :

```bash
docker run -d --name joomla -p 127.0.0.1:8080:80 -e JOOMLA_DB_HOST=db -e JOOMLA_DB_USER=joomla -e JOOMLA_DB_PASSWORD=MdpJoomla2026 -e JOOMLA_DB_NAME=joomla --network cms -v joomla-data:/var/www/html joomla:6
```

## Administration

Administration : `https://cms.corp.exemple.fr/administrator`.

| Menu | Usage |
| --- | --- |
| Contenu → Articles, Catégories, Médias | Rédaction et organisation |
| Menus, Contenu → Modules de site | Navigation et blocs |
| Utilisateurs → Gérer, Groupes, Niveaux d'accès | Comptes et ACL, double authentification |
| Système → Configuration globale | Site, référencement, cache, serveur (forcer HTTPS), droits |
| Système → Gestion des extensions, Mises à jour | Installation et mises à jour |
| Système → Tâches planifiées | Nettoyage, sauvegardes d'extensions, indexation |

<!-- CAPTURE: Panneau d'administration Joomla | _assets/joomla-administration.png -->

## Console

```bash
cd /var/www/joomla
sudo -u www-data php cli/joomla.php list
sudo -u www-data php cli/joomla.php core:update:check && sudo -u www-data php cli/joomla.php core:update
sudo -u www-data php cli/joomla.php update:extensions:check
sudo -u www-data php cli/joomla.php extension:install --path=/tmp/extension.zip
sudo -u www-data php cli/joomla.php user:add --username=redacteur --name="Rédacteur" --email=redacteur@corp.exemple.fr --usergroup=Author --password='MdpTemporaire2026!'
sudo -u www-data php cli/joomla.php user:reset-password --username=jk-admin
sudo -u www-data php cli/joomla.php cache:clean
sudo -u www-data php cli/joomla.php site:down ; sudo -u www-data php cli/joomla.php site:up
sudo -u www-data php cli/joomla.php scheduler:run
```

Planificateur : `* * * * * www-data php /var/www/joomla/cli/joomla.php scheduler:run --all`. Sauvegarde : base et dossier du site (`images/`, `configuration.php`, extensions) ; extension de sauvegarde courante : Akeeba Backup.

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Erreur 404 sur toutes les pages sauf l'accueil | Réécriture d'URL inactive | `.htaccess`, `mod_rewrite` ou `try_files` NGINX |
| Mise à jour bloquée | Droits, extension incompatible | Droits `www-data`, `core:update` en CLI |
| Super utilisateur perdu | Mot de passe oublié | `user:reset-password` ou `user:add --usergroup="Super Users"` |

Commandes : [[90-aide-memoire|aide-mémoire]].

---
title: MediaWiki et DokuWiki
description: Deux wikis libres en PHP — MediaWiki (GPL, moteur de Wikipédia : wikitexte, modèles, catégories, extensions, VisualEditor ; installation par archive sous Linux, Windows et macOS, paquet Debian, image Docker officielle, LocalSettings.php, maintenance/run.php update, sauvegarde mysqldump et dumpBackup) et DokuWiki (GPL v2, sans base de données : fichiers texte, ACL, extensions ; archive dokuwiki-stable, install.php, image Docker dokuwiki/dokuwiki), configuration, sécurité, sauvegarde et mise à jour.
tags: [mediawiki, dokuwiki, wiki, php, docker, documentation]
icon: book-text
---

| | **MediaWiki** | **DokuWiki** |
| --- | --- | --- |
| Licence | GPL v2+ | GPL v2 |
| Stockage | MySQL/MariaDB, PostgreSQL, SQLite | **Fichiers texte** (aucune base) |
| Syntaxe | Wikitexte, modèles, catégories ; VisualEditor | Syntaxe DokuWiki, éditeur simple |
| Droits | Groupes globaux (finesse limitée par page) | **ACL** par espace de noms et page |
| Usage | Grandes encyclopédies internes, documentation publique | Documentation technique d'équipe, procédures, petits intranets |

Autres solutions : [[01-outline-wikijs|Outline, Wiki.js]], [[02-xwiki|XWiki]], [[09-bookstack|BookStack]].

## MediaWiki

Prérequis : PHP 8.2+ (`intl`, `mbstring`, `xml`, `mysql` ou `pgsql`, `apcu`), MariaDB/MySQL ou PostgreSQL, Apache ou NGINX.

```bash
sudo apt install -y apache2 mariadb-server php libapache2-mod-php php-mysql php-intl php-mbstring php-xml php-apcu php-gd imagemagick
sudo mariadb -e "CREATE DATABASE wiki CHARACTER SET binary; CREATE USER 'wiki'@'localhost' IDENTIFIED BY 'MdpWiki2026'; GRANT ALL ON wiki.* TO 'wiki'@'localhost';"
wget https://releases.wikimedia.org/mediawiki/1.46/mediawiki-1.46.2.tar.gz
sudo tar xzf mediawiki-1.46.2.tar.gz -C /var/www && sudo mv /var/www/mediawiki-1.46.2 /var/www/mediawiki
sudo chown -R www-data:www-data /var/www/mediawiki/images
```

Ouvrir `https://wiki.corp.exemple.fr/mw-config/` : l'assistant crée la base, l'administrateur et génère **`LocalSettings.php`**, à déposer à la racine de MediaWiki. Sous Windows : même archive sur IIS ou Apache avec PHP ; sous macOS : MAMP ou Homebrew (`php`, `mariadb`). Paquet Debian `mediawiki` disponible (version de la distribution).

Docker (image officielle, le fichier `LocalSettings.php` est monté après l'assistant) :

```bash
docker run -d --name mediawiki -p 127.0.0.1:8080:80 -v mw_images:/var/www/html/images mediawiki:1.46
# après l'assistant : -v /srv/mediawiki/LocalSettings.php:/var/www/html/LocalSettings.php
```

Réglages courants de `LocalSettings.php` :

```php
$wgServer = "https://wiki.corp.exemple.fr";
$wgLanguageCode = "fr";
$wgEnableUploads = true;
$wgGroupPermissions['*']['createaccount'] = false;   // pas d'inscription libre
$wgGroupPermissions['*']['edit'] = false;            // modification réservée aux comptes
$wgGroupPermissions['*']['read'] = false;            // wiki privé
wfLoadExtension( 'VisualEditor' );
wfLoadExtension( 'LDAPAuthentication2' );            // nécessite les extensions PluggableAuth et LDAPProvider
```

<!-- CAPTURE: Page MediaWiki en édition avec VisualEditor | _assets/mediawiki-visualeditor.png -->

Exploitation :

```bash
cd /var/www/mediawiki
sudo -u www-data php maintenance/run.php update            # après mise à jour ou ajout d'extension
sudo -u www-data php maintenance/run.php createAndPromote --sysop jk 'MdpTemporaire2026!'
sudo -u www-data php maintenance/run.php dumpBackup --full > /srv/sauvegardes/wiki-pages-$(date +%F).xml
mysqldump --single-transaction wiki > /srv/sauvegardes/wiki-$(date +%F).sql
```

Mise à jour : sauvegarder base, `LocalSettings.php`, `images/` et `extensions/`, extraire la nouvelle version, recopier ces éléments, puis `maintenance/run.php update`.

## DokuWiki

Prérequis : PHP 8 (`gd`, `mbstring`, `xml`, `intl`), aucun serveur de base de données.

```bash
wget https://download.dokuwiki.org/src/dokuwiki/dokuwiki-stable.tgz
sudo mkdir -p /var/www/dokuwiki && sudo tar xzf dokuwiki-stable.tgz -C /var/www/dokuwiki --strip-components=1
sudo chown -R www-data:www-data /var/www/dokuwiki
```

Ouvrir `https://doc.corp.exemple.fr/install.php` (nom du wiki, administrateur, politique d'ACL : wiki ouvert, public ou fermé), puis **supprimer `install.php`**. Protéger les dossiers `data/`, `conf/`, `bin/` et `inc/` (règles `.htaccess` fournies pour Apache ; à reproduire avec `deny all;` sous NGINX). Fonctionne de la même manière sous Windows (IIS/Apache + PHP) et macOS.

Docker (image officielle) :

```bash
docker run -d --name dokuwiki -p 127.0.0.1:8081:8080 -v /srv/dokuwiki:/storage dokuwiki/dokuwiki:stable
```

| Menu (Administration) | Usage |
| --- | --- |
| Gestion des utilisateurs | Comptes (ou authentification LDAP/AD par l'extension `authldap`/`authad`) |
| Gestion des ACL | Droits par espace de noms (`infra:*`) et groupe |
| Gestionnaire d'extensions | Extensions et thèmes (installation en un clic) |
| Paramètres de configuration | Titre, langue (`fr`), révisions, envoi de fichiers |

<!-- CAPTURE: Gestion des ACL DokuWiki | _assets/dokuwiki-acl.png -->

Sauvegarde : dossiers `data/` (pages, médias, historique), `conf/` et `lib/plugins/` ; restauration par simple copie. Mise à jour : extension *Upgrade* (en un clic) ou nouvelle archive par-dessus l'ancienne (sans écraser `data/` et `conf/`).

Commandes : [[90-aide-memoire|aide-mémoire]].

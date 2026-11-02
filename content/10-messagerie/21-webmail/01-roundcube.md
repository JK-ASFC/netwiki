---
title: Roundcube
description: Roundcube (GPL v3) — webmail de référence en PHP : prérequis (PHP 8.1+, base MySQL/MariaDB, PostgreSQL ou SQLite), installation par archive complète sous Linux, Windows (IIS) et macOS, assistant /installer, config.inc.php (imap_host, smtp_host, des_key), paquet Debian roundcube, Docker roundcube/roundcubemail (variables ROUNDCUBEMAIL_*), extensions (managesieve, password, enigma, carddav), authentification OAuth2, sécurité, sauvegarde, mise à jour et dépannage.
tags: [roundcube, webmail, imap, php, docker, managesieve]
icon: mail-open
---

**Roundcube** (GPL v3) est le webmail libre le plus répandu : interface moderne (thème Elastic adapté au mobile), carnet d'adresses, filtres Sieve, identités multiples, chiffrement PGP (Enigma), extensions nombreuses. Il se connecte à n'importe quel serveur **IMAP** et **SMTP** ([[02-dovecot/01-presentation-installation|Dovecot]], [[01-postfix/01-presentation|Postfix]], Microsoft 365 en OAuth2). Version 1.7 actuellement.

Prérequis : PHP 8.1+ (`intl`, `mbstring`, `xml`, `dom`, `pdo_mysql`/`pdo_pgsql`/`pdo_sqlite`, `zip`, `gd`), une base de données, un serveur web.

## Installation par archive (Linux)

```bash
sudo apt install -y nginx php-fpm php-mysql php-intl php-mbstring php-xml php-zip php-gd php-curl mariadb-server
sudo mariadb -e "CREATE DATABASE roundcube CHARACTER SET utf8mb4; CREATE USER 'roundcube'@'localhost' IDENTIFIED BY 'MdpRoundcube2026'; GRANT ALL ON roundcube.* TO 'roundcube'@'localhost';"
V=1.7.5
wget https://github.com/roundcube/roundcubemail/releases/download/$V/roundcubemail-$V-complete.tar.gz
sudo tar xzf roundcubemail-$V-complete.tar.gz -C /var/www && sudo mv /var/www/roundcubemail-$V /var/www/roundcube
sudo mysql roundcube < /var/www/roundcube/SQL/mysql.initial.sql
sudo chown -R www-data:www-data /var/www/roundcube/temp /var/www/roundcube/logs
```

Racine web : `/var/www/roundcube/public_html`. Configuration minimale `/var/www/roundcube/config/config.inc.php` (ou assistant `/installer`, à **supprimer** ensuite) :

```php
<?php
$config['db_dsnw'] = 'mysql://roundcube:MdpRoundcube2026@localhost/roundcube';
$config['imap_host'] = 'ssl://imap.corp.exemple.fr:993';
$config['smtp_host'] = 'tls://smtp.corp.exemple.fr:587';
$config['smtp_user'] = '%u';
$config['smtp_pass'] = '%p';
$config['support_url'] = 'https://support.corp.exemple.fr';
$config['product_name'] = 'Messagerie corp.exemple.fr';
$config['des_key'] = 'chaine_aleatoire_de_24_caracteres';
$config['language'] = 'fr_FR';
$config['plugins'] = ['archive', 'zipdownload', 'managesieve', 'password', 'markasjunk'];
$config['skin'] = 'elastic';
```

Paquet de distribution : `sudo apt install roundcube roundcube-plugins` (Debian/Ubuntu, configuration dans `/etc/roundcube/`). RHEL : EPEL `roundcubemail`. **Windows** : IIS + PHP (FastCGI) et la même archive ; **macOS** : PHP de Homebrew ou Docker.

## Docker

```bash
docker run -d --name roundcube -p 127.0.0.1:8083:80 \
  -e ROUNDCUBEMAIL_DEFAULT_HOST=ssl://imap.corp.exemple.fr -e ROUNDCUBEMAIL_DEFAULT_PORT=993 \
  -e ROUNDCUBEMAIL_SMTP_SERVER=tls://smtp.corp.exemple.fr -e ROUNDCUBEMAIL_SMTP_PORT=587 \
  -e ROUNDCUBEMAIL_DB_TYPE=sqlite -e ROUNDCUBEMAIL_PLUGINS=archive,zipdownload,managesieve \
  -v roundcube_db:/var/roundcube/db roundcube/roundcubemail:latest
```

Pour MySQL/PostgreSQL : `ROUNDCUBEMAIL_DB_TYPE`, `ROUNDCUBEMAIL_DB_HOST`, `ROUNDCUBEMAIL_DB_NAME`, `ROUNDCUBEMAIL_DB_USER`, `ROUNDCUBEMAIL_DB_PASSWORD`. Configuration supplémentaire : fichiers `*.php` montés dans `/var/roundcube/config/`.

<!-- CAPTURE: Boîte de réception Roundcube (thème Elastic) | _assets/roundcube-elastic.png -->

## Extensions courantes

| Extension | Usage |
| --- | --- |
| `managesieve` | Filtres et répondeur (Sieve, port 4190 de Dovecot) |
| `password` | Changement de mot de passe (pilote SQL, LDAP, poppassd…) |
| `enigma` | Chiffrement et signature PGP |
| `markasjunk` | Signalement de spam (apprentissage Rspamd/SpamAssassin) |
| `carddav` (tierce) | Carnets d'adresses CardDAV (SOGo, Baïkal, Nextcloud) |
| `oauth2` (cœur) | Connexion par OAuth2/OIDC (Microsoft 365, Keycloak) : `oauth_provider`, `oauth_client_id`… |

## Sécurité, sauvegarde, mise à jour

- HTTPS uniquement, `/installer` supprimé, dossiers `config/`, `temp/`, `logs/` et `SQL/` non accessibles depuis le web, Fail2ban sur `logs/errors.log` (échecs de connexion).
- Sauvegarde : base (préférences, carnets) et `config/`.
- Mise à jour : extraire la nouvelle archive puis `bin/installto.sh /var/www/roundcube` depuis le dossier extrait (met à jour fichiers et schéma).

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| « Connexion au serveur IMAP impossible » | Hôte, port, certificat | `imap_host`, `openssl s_client -connect imap.corp.exemple.fr:993` |
| Envoi refusé (« SMTP Error 535 ») | Authentification SMTP | `smtp_user`/`smtp_pass`, port 587 et STARTTLS |
| Page blanche | Extension PHP manquante, droits | `logs/errors.log`, `php -m` |
| Session perdue derrière un proxy | Cookies, `X-Forwarded-Proto` | `use_https`, en-têtes du proxy |

Commandes : [[90-aide-memoire|aide-mémoire]].

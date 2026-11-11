---
title: PostfixAdmin
description: PostfixAdmin, interface web de gestion des domaines, boîtes et alias virtuels de Postfix et Dovecot (PHP, GPL) — installation (paquet Debian ou archive), base MariaDB ou PostgreSQL, config.local.php, mot de passe d'installation et setup.php, schéma des tables, requêtes SQL de Postfix et de Dovecot, format des mots de passe, administrateurs de domaine, quotas, répondeur, ligne de commande postfixadmin-cli et sécurité.
tags: [postfixadmin, postfix, dovecot, domaines virtuels, mariadb, php, alias, quotas]
icon: inbox
---

**PostfixAdmin** gère dans une base SQL les **domaines**, **boîtes** et **alias** d'un serveur [[04-domaines-virtuels-dovecot|Postfix + Dovecot à domaines virtuels]]. Les administrateurs créent les comptes par une interface web ; Postfix et Dovecot lisent directement la base. Il peut aussi déléguer l'administration d'un domaine à un client.

## Installation

```bash
# Debian / Ubuntu : paquet (configure Apache, PHP et la base via debconf)
sudo apt install postfixadmin

# Ou archive de la dernière version
sudo apt install php-fpm php-mysql php-mbstring php-imap mariadb-server
cd /var/www && sudo wget https://github.com/postfixadmin/postfixadmin/archive/refs/tags/postfixadmin-3.3.15.tar.gz   # version à adapter
sudo tar xzf postfixadmin-*.tar.gz && sudo mv postfixadmin-postfixadmin-* postfixadmin
sudo mkdir -p postfixadmin/templates_c && sudo chown www-data postfixadmin/templates_c
```

La racine web doit pointer vers **`public/`**.

```bash
sudo mysql -e "CREATE DATABASE postfixadmin; CREATE USER 'postfixadmin'@'localhost' IDENTIFIED BY 'MotDePasse'; GRANT ALL ON postfixadmin.* TO 'postfixadmin'@'localhost';"
```

```php /var/www/postfixadmin/config.local.php
<?php
$CONF['configured'] = true;
$CONF['database_type'] = 'mysqli';
$CONF['database_host'] = 'localhost';
$CONF['database_user'] = 'postfixadmin';
$CONF['database_password'] = 'MotDePasse';
$CONF['database_name'] = 'postfixadmin';
$CONF['encrypt'] = 'dovecot:BLF-CRYPT';            // format compris par Dovecot (doveadm pw)
$CONF['dovecotpw'] = '/usr/bin/doveadm pw';
$CONF['default_language'] = 'fr';
$CONF['domain_path'] = 'YES';
$CONF['domain_in_mailbox'] = 'NO';
$CONF['quota'] = 'YES';
$CONF['setup_password'] = 'collez ici le hachage généré par setup.php';
```

Ouvrir `https://serveur/setup.php` : générer le **hachage du mot de passe d'installation**, le recopier dans `setup_password`, laisser setup.php créer les tables, puis créer le **super-administrateur**. Restreindre ensuite l'accès à `setup.php` (ou le renommer).

## Postfix et Dovecot

Tables principales : `domain`, `mailbox` (`username`, `password`, `maildir`, `quota`, `active`), `alias` (`address`, `goto`, `active`), `alias_domain`.

```postfix /etc/postfix/sql/domaines.cf
user = postfix
password = MotDePasseLecture
hosts = 127.0.0.1
dbname = postfixadmin
query = SELECT domain FROM domain WHERE domain='%s' AND active = '1'
```

```postfix /etc/postfix/sql/boites.cf
user = postfix
password = MotDePasseLecture
hosts = 127.0.0.1
dbname = postfixadmin
query = SELECT maildir FROM mailbox WHERE username='%s' AND active = '1'
```

```postfix /etc/postfix/sql/alias.cf
user = postfix
password = MotDePasseLecture
hosts = 127.0.0.1
dbname = postfixadmin
query = SELECT goto FROM alias WHERE address='%s' AND active = '1'
```

```bash
sudo postconf -e "virtual_mailbox_domains = proxy:mysql:/etc/postfix/sql/domaines.cf"
sudo postconf -e "virtual_mailbox_maps = proxy:mysql:/etc/postfix/sql/boites.cf"
sudo postconf -e "virtual_alias_maps = proxy:mysql:/etc/postfix/sql/alias.cf"
postmap -q alice@exemple.fr mysql:/etc/postfix/sql/boites.cf     # test
```

Un compte SQL **en lecture seule** (`postfix`) suffit à Postfix et Dovecot. Côté Dovecot (`dovecot-sql.conf.ext`) :

```text
driver = mysql
connect = host=127.0.0.1 dbname=postfixadmin user=postfix password=MotDePasseLecture
default_pass_scheme = BLF-CRYPT
password_query = SELECT username AS user, password FROM mailbox WHERE username = '%u' AND active = '1'
user_query = SELECT CONCAT('/var/vmail/', maildir) AS home, 5000 AS uid, 5000 AS gid, CONCAT('*:bytes=', quota) AS quota_rule FROM mailbox WHERE username = '%u' AND active = '1'
```

## Fonctions

| Fonction | Remarque |
| --- | --- |
| Administrateurs de domaine | Un client gère ses propres boîtes et alias |
| Quotas | Par boîte et par domaine (appliqués par Dovecot) |
| Alias de domaine | `ancien.fr` → `exemple.fr` |
| Répondeur (vacances) | Script `vacation` fourni, ou Sieve côté Dovecot |
| Changement de mot de passe | Par les utilisateurs, ou par le greffon *password* de Roundcube (voir la page Roundcube du wiki) |
| Journal | Historique des actions des administrateurs |

## Ligne de commande

```bash
sudo postfixadmin-cli domain add exemple.fr --aliases 0 --mailboxes 0
sudo postfixadmin-cli mailbox add alice@exemple.fr --password 'Mdp' --password2 'Mdp' --name "Alice Martin" --quota 2048
sudo postfixadmin-cli alias add contact@exemple.fr --goto alice@exemple.fr
sudo postfixadmin-cli mailbox view alice@exemple.fr
```

## Sécurité

- Interface en **HTTPS** uniquement, idéalement réservée au réseau d'administration ou derrière une authentification supplémentaire.
- Mots de passe stockés dans un format **robuste** (BLF-CRYPT ou SHA512-CRYPT), jamais en clair ou en MD5.
- Mettre à jour régulièrement (application PHP exposée).

Pour une solution intégrée avec interface d'administration, voir aussi les suites Mailcow, Mailu, Modoboa et iRedMail du wiki. Commandes : [[90-aide-memoire|aide-mémoire Postfix]].

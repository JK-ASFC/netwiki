---
title: SnappyMail, SquirrelMail et RainLoop
description: Webmails légers — SnappyMail (AGPL v3, fork maintenu de RainLoop : rapide, sans base de données obligatoire, PGP, Sieve ; archive à extraire, panneau /?admin, mot de passe initial dans _data_/_default_/admin_password.txt, Docker, domaines IMAP/SMTP), SquirrelMail (GPL, historique, plus maintenu activement) et RainLoop (abandonné, failles non corrigées : migrer vers SnappyMail), installation, sécurité et migration.
tags: [snappymail, rainloop, squirrelmail, webmail, php, imap]
icon: mail
---

## SnappyMail

**SnappyMail** (AGPL v3) est un webmail PHP rapide et léger, issu de RainLoop et activement maintenu : interface moderne et mobile, **aucune base de données requise** (fichiers ; SQLite, MySQL ou PostgreSQL facultatifs pour les contacts), PGP (OpenPGP.js et GnuPG), filtres Sieve, plusieurs comptes, extensions. Alternative plus complète : [[01-roundcube|Roundcube]].

```bash
sudo apt install -y nginx php-fpm php-curl php-mbstring php-xml php-zip php-intl php-gd unzip
V=2.38.2
wget https://github.com/the-djmaze/snappymail/releases/download/v$V/snappymail-$V.zip
sudo mkdir -p /var/www/snappymail && sudo unzip snappymail-$V.zip -d /var/www/snappymail
sudo chown -R www-data:www-data /var/www/snappymail/data
```

Le dossier `data/` doit être **inaccessible depuis le web** (règle `location ^~ /data { deny all; }` sous NGINX, `.htaccess` fourni pour Apache). Sous Windows (IIS + PHP) et macOS : même archive. Docker : exemples Compose fournis dans le dépôt (`examples/docker`), avec le dossier de données dans `/var/lib/snappymail`.

Premier accès à l'administration : `https://webmail.corp.exemple.fr/?admin`, compte `admin`, mot de passe généré dans :

```bash
sudo cat /var/www/snappymail/data/_data_/_default_/admin_password.txt
```

Changer ce mot de passe (et activer la 2FA), puis *Domains* : ajouter `corp.exemple.fr` avec IMAP `imap.corp.exemple.fr:993` (SSL/TLS), SMTP `smtp.corp.exemple.fr:587` (STARTTLS, authentification) et Sieve `4190`. Supprimer le domaine d'exemple et désactiver la connexion aux domaines non déclarés.

<!-- CAPTURE: Administration SnappyMail, configuration d'un domaine IMAP et SMTP | _assets/snappymail-domaine.png -->

Mise à jour : depuis l'administration (*About → Update*) ou nouvelle archive par-dessus l'ancienne (le dossier `data/` est conservé).

## SquirrelMail

**SquirrelMail** (GPL) est un webmail historique en PHP, sans JavaScript, très léger. Il n'a plus de version stable récente et n'est plus adapté aux navigateurs ni aux exigences de sécurité actuels : ne pas l'installer pour un nouveau service ; migrer les utilisateurs vers Roundcube ou SnappyMail (les préférences ne se convertissent pas, mais les messages restent sur le serveur IMAP).

## RainLoop (abandonné)

**RainLoop** n'est plus maintenu et comporte des **vulnérabilités connues non corrigées**. Le retirer de tout serveur exposé et le remplacer par **SnappyMail**, qui reprend sa structure : la configuration des domaines (`data/_data_/_default_/domains/`) peut être recopiée, puis vérifiée dans l'administration de SnappyMail.

Commandes : [[90-aide-memoire|aide-mémoire]].

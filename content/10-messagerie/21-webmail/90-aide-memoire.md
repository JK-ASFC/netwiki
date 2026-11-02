---
title: Webmails — aide-mémoire des commandes
description: Commandes Roundcube (installation, schéma SQL, installto.sh, journaux, Docker) et SnappyMail (archive, mot de passe administrateur initial, droits du dossier data), tests IMAP, SMTP et Sieve.
tags: [aide-mémoire, roundcube, snappymail, webmail]
icon: terminal
---

Explications : [[01-roundcube|Roundcube]] · [[02-snappymail-anciens|SnappyMail, SquirrelMail, RainLoop]].

```bash
sudo mysql roundcube < /var/www/roundcube/SQL/mysql.initial.sql
cd roundcubemail-1.7.5 && sudo bin/installto.sh /var/www/roundcube            # mise à jour
sudo tail -f /var/www/roundcube/logs/errors.log
docker logs -f roundcube
sudo cat /var/www/snappymail/data/_data_/_default_/admin_password.txt
sudo chown -R www-data:www-data /var/www/snappymail/data
curl -s -o /dev/null -w "%{http_code}\n" https://webmail.corp.exemple.fr/data/        # doit répondre 403 ou 404
openssl s_client -connect imap.corp.exemple.fr:993 -quiet </dev/null | head -2
openssl s_client -connect smtp.corp.exemple.fr:587 -starttls smtp </dev/null | head -5
nc -zv imap.corp.exemple.fr 4190                                               # ManageSieve
```

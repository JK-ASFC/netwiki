---
title: Suites de messagerie — aide-mémoire des commandes
description: Commandes Mailcow (generate_config.sh, update.sh, backup_and_restore.sh, journaux), Mailu (flask mailu admin, user, alias), docker-mailserver (setup email, alias, config dkim, help), Modoboa (run.py), iRedMail (iRedMail.sh), tests DNS et SMTP (dig, openssl s_client, swaks).
tags: [aide-mémoire, mailcow, mailu, docker-mailserver, modoboa, iredmail]
icon: terminal
---

Explications : [[01-mailcow-mailu-docker-mailserver|Mailcow, Mailu, docker-mailserver]] · [[02-modoboa-iredmail|Modoboa, iRedMail]].

```bash
cd /opt/mailcow-dockerized && sudo ./update.sh
sudo MAILCOW_BACKUP_LOCATION=/srv/sauvegardes/mailcow ./helper-scripts/backup_and_restore.sh backup all --delete-days 7
sudo docker compose logs -f --tail=100 postfix-mailcow dovecot-mailcow
cd /mailu && sudo docker compose exec admin flask mailu admin admin corp.exemple.fr 'MdpAdminMailu2026!'
sudo docker compose exec admin flask mailu user jk corp.exemple.fr 'MdpTemporaire2026!'
sudo docker compose exec admin flask mailu alias postmaster corp.exemple.fr jk@corp.exemple.fr
docker exec -ti mailserver setup email add jk@corp.exemple.fr
docker exec -ti mailserver setup email list
docker exec -ti mailserver setup alias add postmaster@corp.exemple.fr jk@corp.exemple.fr
docker exec -ti mailserver setup config dkim
cd modoboa-installer && sudo ./run.py --stop-after-configfile-check corp.exemple.fr && sudo ./run.py corp.exemple.fr
cd iRedMail-1.8.9 && sudo bash iRedMail.sh
```

## Tests

```bash
dig +short MX corp.exemple.fr ; dig +short TXT corp.exemple.fr ; dig +short TXT _dmarc.corp.exemple.fr
dig +short TXT dkim._domainkey.corp.exemple.fr ; dig +short -x 203.0.113.25
openssl s_client -connect mail.corp.exemple.fr:587 -starttls smtp </dev/null | openssl x509 -noout -subject -dates
swaks --to jk@corp.exemple.fr --server mail.corp.exemple.fr --port 587 --tls --auth-user test@corp.exemple.fr
```

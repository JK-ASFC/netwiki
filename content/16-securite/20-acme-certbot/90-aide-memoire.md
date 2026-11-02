---
title: Certbot et acme.sh — aide-mémoire des commandes
description: Commandes Certbot (certonly, --nginx, --apache, --webroot, --standalone, --dns-*, --staging, --dry-run, renew, certificates, delete, revoke, reconfigure, --cert-name, --expand, hooks) et acme.sh (--issue, --renew, --force, --install-cert, --deploy, --list, --remove, --revoke, --set-default-ca, --upgrade, --cron, --debug), avec contrôles d'expiration.
tags: [aide-mémoire, certbot, acme.sh, letsencrypt]
icon: terminal
---

Explications : [[01-certbot|Certbot]] · [[02-acme-sh|acme.sh]].

```bash
sudo certbot certificates ; sudo certbot renew --dry-run ; sudo certbot renew --cert-name www.corp.exemple.fr --force-renewal
sudo certbot certonly --staging --standalone -d test.corp.exemple.fr ; sudo certbot --expand -d a.corp.exemple.fr -d b.corp.exemple.fr
sudo certbot delete --cert-name ancien.corp.exemple.fr ; sudo certbot revoke --cert-path /etc/letsencrypt/live/x/cert.pem --reason superseded
sudo certbot reconfigure --cert-name www.corp.exemple.fr --deploy-hook "systemctl reload nginx"
acme.sh --list ; acme.sh --renew -d www.corp.exemple.fr --ecc --force ; acme.sh --remove -d ancien.corp.exemple.fr
acme.sh --revoke -d ancien.corp.exemple.fr ; acme.sh --upgrade --auto-upgrade ; acme.sh --issue … --debug 2
echo | openssl s_client -connect www.corp.exemple.fr:443 -servername www.corp.exemple.fr 2>/dev/null | openssl x509 -noout -enddate
```

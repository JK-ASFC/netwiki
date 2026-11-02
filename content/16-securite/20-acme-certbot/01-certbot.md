---
title: Certbot
description: Certbot (EFF) — client ACME de référence pour Let's Encrypt et autres AC ACME : installation (snap recommandé, paquets Debian/RHEL, pip, Windows obsolète), greffons d'authentification et d'installation (apache, nginx, webroot, standalone, dns-* pour Cloudflare, OVH, RFC 2136, Route 53, manual), certificats génériques par DNS-01, renouvellement automatique (timer systemd, certbot renew, hooks pre/post/deploy), AC interne ACME (--server, step-ca), gestion (certificates, delete, revoke), emplacement des fichiers et dépannage des limites de débit.
tags: [certbot, letsencrypt, acme, tls, certificats, renouvellement]
icon: info
---

**Certbot** obtient et **renouvelle automatiquement** des certificats TLS gratuits auprès de **Let's Encrypt** (ou de toute AC compatible ACME, y compris une AC interne comme [[01-step-ca|step-ca]]). L'utilisation de base avec Apache et NGINX figure dans [[02-apache/04-https-tls|Apache]] et [[03-nginx/04-https-tls|NGINX]] ; cette fiche couvre les cas avancés.

## Installation

```bash
sudo snap install --classic certbot && sudo ln -s /snap/bin/certbot /usr/bin/certbot   # méthode recommandée par l'EFF
sudo apt install certbot python3-certbot-nginx python3-certbot-dns-rfc2136               # paquets Debian/Ubuntu
sudo dnf install certbot python3-certbot-apache                                           # RHEL (EPEL)
```

Windows : le client Certbot pour Windows n'est plus maintenu ; utiliser **win-acme** ou [[02-acme-sh|acme.sh]] (WSL), ou des outils intégrés (IIS : win-acme).

## Défis et greffons

| Méthode | Quand |
| --- | --- |
| `--nginx`, `--apache` | Serveur web local : obtient et configure le certificat |
| `--webroot -w /var/www/html` | Serveur web qui reste en service, sans modification de sa configuration |
| `--standalone` | Aucun serveur web (port 80 libre temporairement) |
| `--dns-*` (DNS-01) | **Certificats génériques**, serveurs internes non joignables depuis Internet |

```bash
sudo certbot --nginx -d www.corp.exemple.fr -d corp.exemple.fr
sudo certbot certonly --webroot -w /var/www/html -d intranet.corp.exemple.fr
sudo certbot certonly --dns-rfc2136 --dns-rfc2136-credentials /etc/letsencrypt/rfc2136.ini \
  -d '*.corp.exemple.fr' -d corp.exemple.fr --preferred-challenges dns-01
sudo certbot certonly --server https://ca.corp.exemple.fr/acme/acme/directory --standalone -d srv-app-01.corp.exemple.fr   # AC interne
```

## Renouvellement et déploiement

```bash
systemctl list-timers | grep certbot           # timer installé par le paquet ou le snap (2 fois par jour)
sudo certbot renew --dry-run
sudo certbot renew --deploy-hook "systemctl reload nginx"
echo 'systemctl reload postfix dovecot' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/messagerie.sh && sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/messagerie.sh
```

Fichiers : `/etc/letsencrypt/live/<nom>/` (`fullchain.pem`, `privkey.pem`) — toujours pointer les services vers ces liens, jamais vers `archive/`. Attention aux **limites de débit** de Let's Encrypt (certificats par domaine et par semaine) : testez avec `--staging`.

Suite : [[02-acme-sh|acme.sh]] · [[90-aide-memoire|aide-mémoire]].

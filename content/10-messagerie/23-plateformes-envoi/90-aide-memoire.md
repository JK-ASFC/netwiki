---
title: Haraka et Postal — aide-mémoire
description: Commandes et fichiers de Haraka (installation npm, haraka -i, plugins, smtp_forward) et de Postal (bootstrap, initialize, make-user, start, status, upgrade, API d'envoi).
tags: [aide-mémoire, haraka, postal, smtp]
icon: terminal
---

Explications : [[01-haraka|Haraka]] · [[02-postal|Postal]].

## Haraka

```bash
sudo npm install -g Haraka && sudo haraka -i /etc/haraka
sudo systemctl restart haraka ; journalctl -u haraka -f
# Fichiers : config/smtp.ini, me, plugins, host_list, smtp_forward.ini, tls.ini
```

## Postal

```bash
sudo postal bootstrap postal.exemple.fr ; sudo postal initialize ; sudo postal make-user
sudo postal start ; sudo postal status ; sudo postal logs ; sudo postal upgrade
curl -s -X POST https://postal.exemple.fr/api/v1/send/message -H "X-Server-API-Key: CLE" \
  -H "Content-Type: application/json" -d '{"to":["a@exemple.org"],"from":"noreply@exemple.fr","subject":"Test","plain_body":"Bonjour"}'
```

---
title: Mailpit — aide-mémoire des commandes
description: Commandes Mailpit avec exemples — lancement (binaire, Docker), options (ports SMTP et web, base persistante, authentification, TLS, relais), envoi de test (sendmail, swaks), API REST (liste, recherche, lecture, suppression, statistiques), configuration des applications (PHP, Django, Node.js), usage en intégration continue.
tags: [aide-mémoire, mailpit, smtp, tests, api, développement]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Mailpit]].

## Lancement

```bash
mailpit                                                # SMTP 1025, web 8025
mailpit --smtp 0.0.0.0:1025 --listen 0.0.0.0:8025 --database /srv/mailpit/mailpit.db --max 5000
mailpit --ui-auth-file /etc/mailpit/htpasswd --smtp-auth-accept-any --smtp-auth-allow-insecure
docker run -d --name mailpit -p 8025:8025 -p 1025:1025 -v mailpit-data:/data -e MP_DATABASE=/data/mailpit.db axllent/mailpit
```

## Envoi de test

```bash
swaks --to test@exemple.fr --server 127.0.0.1:1025 --header "Subject: Test Mailpit"
printf "Subject: Bonjour\n\nCorps du message\n" | mailpit sendmail -S 127.0.0.1:1025 test@exemple.fr
```

## API REST

```bash
M=http://127.0.0.1:8025/api/v1
curl -s $M/messages | jq '.messages[] | {ID, Subject, From: .From.Address}'
curl -s "$M/search?query=subject:facture" | jq '.messages_count'
curl -s $M/message/latest | jq '{Subject, Text}'
curl -s $M/message/<ID>/raw > message.eml
curl -s -X DELETE $M/messages                          # tout supprimer
curl -s $M/info | jq .
```

## Configuration des applications

| Pile | Réglage |
| --- | --- |
| PHP | `sendmail_path = "/usr/local/bin/mailpit sendmail"` ou SMTP 127.0.0.1:1025 |
| Django | `EMAIL_HOST = "127.0.0.1"`, `EMAIL_PORT = 1025` |
| Node.js (nodemailer) | `host: "127.0.0.1", port: 1025, secure: false` |
| Laravel | `MAIL_HOST=127.0.0.1`, `MAIL_PORT=1025` |

Mailpit est un outil de **développement et de recette** : ne l'exposez pas sur Internet et n'y faites jamais transiter de vrais messages d'utilisateurs.

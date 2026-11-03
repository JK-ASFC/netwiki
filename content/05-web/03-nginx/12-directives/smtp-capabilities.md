---
title: "smtp_capabilities"
description: "Directive nginx smtp_capabilities (ngx_mail_smtp_module) — Définit la liste des extensions du protocole SMTP transmise au client en réponse à la commande EHLO. Les méthodes d'authentification indiquées dans la directive smtp_auth et STARTTLS sont ajoutées…"
tags: [nginx, directive, ngx_mail_smtp_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `smtp_capabilities extension ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_smtp_module\|ngx_mail_smtp_module]] |

## Utilisation

Définit la liste des extensions du protocole SMTP transmise au client en réponse à la commande `EHLO`. Les méthodes d'authentification indiquées dans la directive [[12-directives/smtp-auth|smtp_auth]] et [STARTTLS](https://datatracker.ietf.org/doc/html/rfc3207) sont ajoutées automatiquement à cette liste selon la valeur de la directive [[12-directives/starttls|starttls]].

Il est utile d'indiquer les extensions prises en charge par le MTA vers lequel les clients sont relayés (si elles concernent des commandes utilisées après l'authentification, lorsque nginx relaie de façon transparente la connexion du client).

La liste actuelle des extensions normalisées est publiée sur [www.iana.org](http://www.iana.org/assignments/mail-parameters).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

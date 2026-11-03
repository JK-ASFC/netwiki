---
title: "smtp_greeting_delay"
description: "Directive nginx smtp_greeting_delay (ngx_mail_smtp_module) — Permet d'attendre un délai avant d'envoyer le message d'accueil SMTP, afin de rejeter les clients qui envoient des commandes SMTP sans attendre ce message."
tags: [nginx, directive, ngx_mail_smtp_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `smtp_greeting_delay time;` |
| **Valeur par défaut** | `smtp_greeting_delay 0;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_smtp_module\|ngx_mail_smtp_module]] |

## Utilisation

Permet d'attendre un délai avant d'envoyer le message d'accueil SMTP, afin de rejeter les clients qui envoient des commandes SMTP sans attendre ce message.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

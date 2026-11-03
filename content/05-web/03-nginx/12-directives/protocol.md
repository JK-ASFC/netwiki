---
title: "protocol"
description: "Directive nginx protocol (ngx_mail_core_module) — Définit le protocole du serveur mandaté. Les protocoles pris en charge sont IMAP, POP3 et SMTP. Si la directive n'est pas définie, le protocole peut être détecté automatiquement d'après le port…"
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `protocol imap \| pop3 \| smtp;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Définit le protocole du serveur mandaté. Les protocoles pris en charge sont [[11-modules/04-mail/ngx_mail_imap_module|IMAP]], [[11-modules/04-mail/ngx_mail_pop3_module|POP3]] et [[11-modules/04-mail/ngx_mail_smtp_module|SMTP]].

Si la directive n'est pas définie, le protocole peut être détecté automatiquement d'après le port standard indiqué dans la directive [[12-directives/listen-mail-core|listen]] :

- `imap`: 143, 993
- `pop3`: 110, 995
- `smtp`: 25, 587, 465

Les protocoles inutiles peuvent être désactivés avec les paramètres de [[10-guides/01-introduction/configure|configuration]] `--without-mail_imap_module`, `--without-mail_pop3_module` et `--without-mail_smtp_module`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ssl_session_tickets (ngx_mail_ssl_module)"
description: "Directive nginx ssl_session_tickets (ngx_mail_ssl_module) — Active ou désactive la reprise de session par tickets de session TLS."
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_tickets on \| off;` |
| **Valeur par défaut** | `ssl_session_tickets on;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.5.9 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Active ou désactive la reprise de session par [tickets de session TLS](https://datatracker.ietf.org/doc/html/rfc5077).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

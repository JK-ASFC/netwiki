---
title: "ssl_session_tickets (ngx_mail_ssl_module)"
description: "Directive nginx ssl_session_tickets (ngx_mail_ssl_module) — Enables or disables session resumption through TLS session tickets."
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_tickets on \| off;` |
| **Valeur par défaut** | `ssl_session_tickets on;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.5.9 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Enables or disables session resumption through [TLS session tickets](https://datatracker.ietf.org/doc/html/rfc5077).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

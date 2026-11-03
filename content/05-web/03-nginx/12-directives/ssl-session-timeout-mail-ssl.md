---
title: "ssl_session_timeout (ngx_mail_ssl_module)"
description: "Directive nginx ssl_session_timeout (ngx_mail_ssl_module) — Specifies a time during which a client may reuse the session parameters."
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_timeout time;` |
| **Valeur par défaut** | `ssl_session_timeout 5m;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Specifies a time during which a client may reuse the session parameters.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

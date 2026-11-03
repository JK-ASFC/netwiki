---
title: "auth_http_timeout"
description: "Directive nginx auth_http_timeout (ngx_mail_auth_http_module) — Sets the timeout for communication with the authentication server."
tags: [nginx, directive, ngx_mail_auth_http_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_http_timeout time;` |
| **Valeur par défaut** | `auth_http_timeout 60s;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_auth_http_module\|ngx_mail_auth_http_module]] |

## Utilisation

Sets the timeout for communication with the authentication server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

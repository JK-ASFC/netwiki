---
title: "auth_http_timeout"
description: "Directive nginx auth_http_timeout (ngx_mail_auth_http_module) — Définit le délai de communication avec le serveur d'authentification."
tags: [nginx, directive, ngx_mail_auth_http_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_http_timeout time;` |
| **Valeur par défaut** | `auth_http_timeout 60s;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_auth_http_module\|ngx_mail_auth_http_module]] |

## Utilisation

Définit le délai de communication avec le serveur d'authentification.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

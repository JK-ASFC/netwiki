---
title: "auth_require"
description: "Directive nginx auth_require (ngx_http_auth_require_module) — Enables authorization based on the specified variables. The access is allowed only if all the variables are not empty and are not equal to “0”. Otherwise, the module returns 403 code, which can be…"
tags: [nginx, directive, ngx_http_auth_require_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_require $value ... [error=4xx \| 5xx];` |
| **Valeur par défaut** | `auth_require off;` |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_require_module\|ngx_http_auth_require_module]] |

## Utilisation

Enables authorization based on the specified variables. The access is allowed only if all the variables are not empty and are not equal to “0”. Otherwise, the module returns `403` code, which can be overridden by the `error` parameter. Several `auth_require` directives can be used to return different error codes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

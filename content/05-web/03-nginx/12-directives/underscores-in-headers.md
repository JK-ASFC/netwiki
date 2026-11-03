---
title: "underscores_in_headers"
description: "Directive nginx underscores_in_headers (ngx_http_core_module) — Enables or disables the use of underscores in client request header fields. When the use of underscores is disabled, request header fields whose names contain underscores are marked as invalid and…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `underscores_in_headers on \| off;` |
| **Valeur par défaut** | `underscores_in_headers off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables the use of underscores in client request header fields. When the use of underscores is disabled, request header fields whose names contain underscores are marked as invalid and become subject to the [[12-directives/ignore-invalid-headers|ignore_invalid_headers]] directive.

If the directive is specified on the [[12-directives/server-http-core|server]] level, the value from the default server can be used. Details are provided in the “[[10-guides/02-http/server-names|Virtual server selection]]” section.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

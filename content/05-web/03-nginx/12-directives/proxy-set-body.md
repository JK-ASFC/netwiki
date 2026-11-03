---
title: "proxy_set_body"
description: "Directive nginx proxy_set_body (ngx_http_proxy_module) — Allows redefining the request body passed to the proxied server. The value can contain text, variables, and their combination."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_set_body value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Allows redefining the request body passed to the proxied server. The *value* can contain text, variables, and their combination.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

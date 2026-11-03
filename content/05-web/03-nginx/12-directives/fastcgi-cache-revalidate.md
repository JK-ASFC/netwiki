---
title: "fastcgi_cache_revalidate"
description: "Directive nginx fastcgi_cache_revalidate (ngx_http_fastcgi_module) — Enables revalidation of expired cache items using conditional requests with the If-Modified-Since and If-None-Match header fields."
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_revalidate on \| off;` |
| **Valeur par défaut** | `fastcgi_cache_revalidate off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.7 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Enables revalidation of expired cache items using conditional requests with the `If-Modified-Since` and `If-None-Match` header fields.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "fastcgi_cache_min_uses"
description: "Directive nginx fastcgi_cache_min_uses (ngx_http_fastcgi_module) — Sets the number of requests after which the response will be cached."
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_min_uses number;` |
| **Valeur par défaut** | `fastcgi_cache_min_uses 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Sets the *number* of requests after which the response will be cached.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

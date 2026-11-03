---
title: "fastcgi_cache_min_uses"
description: "Directive nginx fastcgi_cache_min_uses (ngx_http_fastcgi_module) — Définit le nombre (number) de requêtes au bout duquel la réponse est mise en cache."
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_min_uses number;` |
| **Valeur par défaut** | `fastcgi_cache_min_uses 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit le nombre (*number*) de requêtes au bout duquel la réponse est mise en cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

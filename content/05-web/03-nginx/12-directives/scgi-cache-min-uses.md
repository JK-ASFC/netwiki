---
title: "scgi_cache_min_uses"
description: "Directive nginx scgi_cache_min_uses (ngx_http_scgi_module) — Définit le nombre (number) de requêtes au bout duquel la réponse est mise en cache."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_cache_min_uses number;` |
| **Valeur par défaut** | `scgi_cache_min_uses 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Définit le nombre (*number*) de requêtes au bout duquel la réponse est mise en cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

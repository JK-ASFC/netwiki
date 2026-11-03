---
title: "scgi_cache_revalidate"
description: "Directive nginx scgi_cache_revalidate (ngx_http_scgi_module) — Active la revalidation des éléments expirés du cache à l'aide de requêtes conditionnelles avec les champs d'en-tête If-Modified-Since et If-None-Match."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_cache_revalidate on \| off;` |
| **Valeur par défaut** | `scgi_cache_revalidate off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.7 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Active la revalidation des éléments expirés du cache à l'aide de requêtes conditionnelles avec les champs d'en-tête `If-Modified-Since` et `If-None-Match`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

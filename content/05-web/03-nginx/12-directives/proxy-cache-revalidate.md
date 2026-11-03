---
title: "proxy_cache_revalidate"
description: "Directive nginx proxy_cache_revalidate (ngx_http_proxy_module) — Active la revalidation des éléments expirés du cache à l'aide de requêtes conditionnelles avec les champs d'en-tête If-Modified-Since et If-None-Match."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_revalidate on \| off;` |
| **Valeur par défaut** | `proxy_cache_revalidate off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.7 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Active la revalidation des éléments expirés du cache à l'aide de requêtes conditionnelles avec les champs d'en-tête `If-Modified-Since` et `If-None-Match`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "fastcgi_cache_lock"
description: "Directive nginx fastcgi_cache_lock (ngx_http_fastcgi_module) — Si cette option est activée, une seule requête à la fois peut alimenter un nouvel élément de cache, identifié selon la directive fastcgi_cache_key, en transmettant la requête au serveur FastCGI. Les…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_lock on \| off;` |
| **Valeur par défaut** | `fastcgi_cache_lock off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.12 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Si cette option est activée, une seule requête à la fois peut alimenter un nouvel élément de cache, identifié selon la directive [[12-directives/fastcgi-cache-key|fastcgi_cache_key]], en transmettant la requête au serveur FastCGI. Les autres requêtes du même élément attendent soit que la réponse apparaisse dans le cache, soit que le verrou de cet élément soit libéré, pendant au plus la durée définie par la directive [[12-directives/fastcgi-cache-lock-timeout|fastcgi_cache_lock_timeout]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

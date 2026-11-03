---
title: "proxy_cache_lock_age"
description: "Directive nginx proxy_cache_lock_age (ngx_http_proxy_module) — Si la dernière requête transmise au serveur mandaté pour alimenter un nouvel élément de cache ne s'est pas terminée dans la durée (time) indiquée, une requête supplémentaire peut être transmise au…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_lock_age time;` |
| **Valeur par défaut** | `proxy_cache_lock_age 5s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.8 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Si la dernière requête transmise au serveur mandaté pour alimenter un nouvel élément de cache ne s'est pas terminée dans la durée (*time*) indiquée, une requête supplémentaire peut être transmise au serveur mandaté.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

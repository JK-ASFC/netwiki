---
title: "proxy_cache_lock_timeout"
description: "Directive nginx proxy_cache_lock_timeout (ngx_http_proxy_module) — Définit un délai pour proxy_cache_lock. Une fois ce délai (time) écoulé, la requête est transmise au serveur mandaté, mais la réponse n'est pas mise en cache. NOTE Avant la version 1.7.8, la réponse…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_lock_timeout time;` |
| **Valeur par défaut** | `proxy_cache_lock_timeout 5s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.12 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit un délai pour [[12-directives/proxy-cache-lock|proxy_cache_lock]]. Une fois ce délai (*time*) écoulé, la requête est transmise au serveur mandaté, mais la réponse n'est pas mise en cache.

> [!NOTE]
> Avant la version 1.7.8, la réponse pouvait être mise en cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

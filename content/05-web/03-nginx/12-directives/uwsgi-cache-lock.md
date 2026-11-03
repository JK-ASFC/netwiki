---
title: "uwsgi_cache_lock"
description: "Directive nginx uwsgi_cache_lock (ngx_http_uwsgi_module) — Si cette option est activée, une seule requête à la fois peut alimenter un nouvel élément de cache, identifié selon la directive uwsgi_cache_key, en transmettant la requête au serveur uwsgi. Les…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_cache_lock on \| off;` |
| **Valeur par défaut** | `uwsgi_cache_lock off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.12 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Si cette option est activée, une seule requête à la fois peut alimenter un nouvel élément de cache, identifié selon la directive [[12-directives/uwsgi-cache-key|uwsgi_cache_key]], en transmettant la requête au serveur uwsgi. Les autres requêtes du même élément attendent soit que la réponse apparaisse dans le cache, soit que le verrou de cet élément soit libéré, pendant au plus la durée définie par la directive [[12-directives/uwsgi-cache-lock-timeout|uwsgi_cache_lock_timeout]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

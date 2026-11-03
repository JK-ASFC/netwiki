---
title: "fastcgi_cache_methods"
description: "Directive nginx fastcgi_cache_methods (ngx_http_fastcgi_module) — Si la méthode de la requête du client figure dans cette directive, la réponse est mise en cache. Les méthodes « GET » et « HEAD » sont toujours ajoutées à la liste, mais il est recommandé de les…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_methods GET \| HEAD \| POST ...;` |
| **Valeur par défaut** | `fastcgi_cache_methods GET HEAD;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.59 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Si la méthode de la requête du client figure dans cette directive, la réponse est mise en cache. Les méthodes « `GET` » et « `HEAD` » sont toujours ajoutées à la liste, mais il est recommandé de les indiquer explicitement. Voir aussi la directive [[12-directives/fastcgi-no-cache|fastcgi_no_cache]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

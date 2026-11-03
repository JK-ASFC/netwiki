---
title: "scgi_cache_methods"
description: "Directive nginx scgi_cache_methods (ngx_http_scgi_module) — Si la méthode de la requête du client figure dans cette directive, la réponse est mise en cache. Les méthodes « GET » et « HEAD » sont toujours ajoutées à la liste, mais il est recommandé de les…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_cache_methods GET \| HEAD \| POST ...;` |
| **Valeur par défaut** | `scgi_cache_methods GET HEAD;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Si la méthode de la requête du client figure dans cette directive, la réponse est mise en cache. Les méthodes « `GET` » et « `HEAD` » sont toujours ajoutées à la liste, mais il est recommandé de les indiquer explicitement. Voir aussi la directive [[12-directives/scgi-no-cache|scgi_no_cache]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

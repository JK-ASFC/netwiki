---
title: "fastcgi_cache_background_update"
description: "Directive nginx fastcgi_cache_background_update (ngx_http_fastcgi_module) — Permet de lancer une sous-requête en arrière-plan pour mettre à jour un élément expiré du cache, pendant qu'une réponse en cache périmée est renvoyée au client. Il faut alors autoriser l'utilisation…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_background_update on \| off;` |
| **Valeur par défaut** | `fastcgi_cache_background_update off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.11.10 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Permet de lancer une sous-requête en arrière-plan pour mettre à jour un élément expiré du cache, pendant qu'une réponse en cache périmée est renvoyée au client. Il faut alors autoriser l'utilisation d'une réponse en cache périmée pendant sa mise à jour.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

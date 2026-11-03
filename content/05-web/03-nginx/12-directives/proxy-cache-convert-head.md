---
title: "proxy_cache_convert_head"
description: "Directive nginx proxy_cache_convert_head (ngx_http_proxy_module) — Active ou désactive la conversion de la méthode « HEAD » en « GET » pour la mise en cache. Si la conversion est désactivée, la clé de cache doit inclure $request_method."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_convert_head on \| off;` |
| **Valeur par défaut** | `proxy_cache_convert_head on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.9.7 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Active ou désactive la conversion de la méthode « `HEAD` » en « `GET` » pour la mise en cache. Si la conversion est désactivée, la [[12-directives/proxy-cache-key|clé de cache]] doit inclure `$request_method`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

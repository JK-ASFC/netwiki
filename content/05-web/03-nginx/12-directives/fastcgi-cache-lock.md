---
title: "fastcgi_cache_lock"
description: "Directive nginx fastcgi_cache_lock (ngx_http_fastcgi_module) — When enabled, only one request at a time will be allowed to populate a new cache element identified according to the fastcgi_cache_key directive by passing a request to a FastCGI server. Other…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_lock on \| off;` |
| **Valeur par défaut** | `fastcgi_cache_lock off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.12 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

When enabled, only one request at a time will be allowed to populate a new cache element identified according to the [[12-directives/fastcgi-cache-key|fastcgi_cache_key]] directive by passing a request to a FastCGI server. Other requests of the same cache element will either wait for a response to appear in the cache or the cache lock for this element to be released, up to the time set by the [[12-directives/fastcgi-cache-lock-timeout|fastcgi_cache_lock_timeout]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

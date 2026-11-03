---
title: "fastcgi_cache_lock_timeout"
description: "Directive nginx fastcgi_cache_lock_timeout (ngx_http_fastcgi_module) — Sets a timeout for fastcgi_cache_lock. When the time expires, the request will be passed to the FastCGI server, however, the response will not be cached. NOTE Before 1.7.8, the response could be…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_lock_timeout time;` |
| **Valeur par défaut** | `fastcgi_cache_lock_timeout 5s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.12 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Sets a timeout for [[12-directives/fastcgi-cache-lock|fastcgi_cache_lock]]. When the *time* expires, the request will be passed to the FastCGI server, however, the response will not be cached.

> [!NOTE]
> Before 1.7.8, the response could be cached.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

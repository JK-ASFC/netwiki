---
title: "proxy_cache_convert_head"
description: "Directive nginx proxy_cache_convert_head (ngx_http_proxy_module) — Enables or disables the conversion of the “HEAD” method to “GET” for caching. When the conversion is disabled, the cache key should be configured to include the $request_method."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_convert_head on \| off;` |
| **Valeur par défaut** | `proxy_cache_convert_head on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.9.7 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Enables or disables the conversion of the “`HEAD`” method to “`GET`” for caching. When the conversion is disabled, the [[12-directives/proxy-cache-key|cache key]] should be configured to include the `$request_method`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

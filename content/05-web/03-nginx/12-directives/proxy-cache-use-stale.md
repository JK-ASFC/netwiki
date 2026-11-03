---
title: "proxy_cache_use_stale"
description: "Directive nginx proxy_cache_use_stale (ngx_http_proxy_module) — Determines in which cases a stale cached response can be used during communication with the proxied server. The directive’s parameters match the parameters of the proxy_next_upstream directive. The…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_use_stale error \| timeout \| invalid_header \| updating \| http_500 \| http_502 \| http_503 \| http_504 \| http_403 \| http_404 \| http_429 \| off ...;` |
| **Valeur par défaut** | `proxy_cache_use_stale off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Determines in which cases a stale cached response can be used during communication with the proxied server. The directive’s parameters match the parameters of the [[12-directives/proxy-next-upstream-http-proxy|proxy_next_upstream]] directive.

The `error` parameter also permits using a stale cached response if a proxied server to process a request cannot be selected.

Additionally, the `updating` parameter permits using a stale cached response if it is currently being updated. This allows minimizing the number of accesses to proxied servers when updating cached data.

Using a stale cached response can also be enabled directly in the response header for a specified number of seconds after the response became stale (1.11.10). This has lower priority than using the directive parameters.

- The “[stale-while-revalidate](https://datatracker.ietf.org/doc/html/rfc5861#section-3)” extension of the `Cache-Control` header field permits using a stale cached response if it is currently being updated.

- The “[stale-if-error](https://datatracker.ietf.org/doc/html/rfc5861#section-4)” extension of the `Cache-Control` header field permits using a stale cached response in case of an error.

To minimize the number of accesses to proxied servers when populating a new cache element, the [[12-directives/proxy-cache-lock|proxy_cache_lock]] directive can be used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

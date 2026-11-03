---
title: "limit_conn_zone (ngx_http_limit_conn_module)"
description: "Directive nginx limit_conn_zone (ngx_http_limit_conn_module) — Sets parameters for a shared memory zone that will keep states for various keys. In particular, the state includes the current number of connections. The key can contain text, variables, and their…"
tags: [nginx, directive, ngx_http_limit_conn_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn_zone key zone=name:size;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_limit_conn_module\|ngx_http_limit_conn_module]] |

## Utilisation

Sets parameters for a shared memory zone that will keep states for various keys. In particular, the state includes the current number of connections. The *key* can contain text, variables, and their combination. Requests with an empty key value are not accounted.

> [!NOTE]
> Prior to version 1.7.6, a *key* could contain exactly one variable.

Usage example:

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;
```

Here, a client IP address serves as a key. Note that instead of `$remote_addr`, the `$binary_remote_addr` variable is used here. The `$remote_addr` variable’s size can vary from 7 to 15 bytes. The stored state occupies either 32 or 64 bytes of memory on 32-bit platforms and always 64 bytes on 64-bit platforms. The `$binary_remote_addr` variable’s size is always 4 bytes for IPv4 addresses or 16 bytes for IPv6 addresses. The stored state always occupies 32 or 64 bytes on 32-bit platforms and 64 bytes on 64-bit platforms. One megabyte zone can keep about 32 thousand 32-byte states or about 16 thousand 64-byte states. If the zone storage is exhausted, the server will return the [[12-directives/limit-conn-status|error]] to all further requests.

> [!NOTE]
> Additionally, as part of our [abonnement commercial](https://nginx.com/products/), the [[11-modules/02-http/ngx_http_api_module|status information]] for each such shared memory zone can be [[11-modules/02-http/ngx_http_api_module|obtained]] or [[11-modules/02-http/ngx_http_api_module|reset]] with the [[11-modules/02-http/ngx_http_api_module|API]] since 1.17.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "limit_req_zone"
description: "Directive nginx limit_req_zone (ngx_http_limit_req_module) — Sets parameters for a shared memory zone that will keep states for various keys. In particular, the state stores the current number of excessive requests. The key can contain text, variables, and…"
tags: [nginx, directive, ngx_http_limit_req_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_req_zone key zone=name:size rate=rate [sync];` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_limit_req_module\|ngx_http_limit_req_module]] |

## Utilisation

Sets parameters for a shared memory zone that will keep states for various keys. In particular, the state stores the current number of excessive requests. The *key* can contain text, variables, and their combination. Requests with an empty key value are not accounted.

> [!NOTE]
> Prior to version 1.7.6, a *key* could contain exactly one variable.

Usage example:

```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
```

Here, the states are kept in a 10 megabyte zone “one”, and an average request processing rate for this zone cannot exceed 1 request per second.

A client IP address serves as a key. Note that instead of `$remote_addr`, the `$binary_remote_addr` variable is used here. The `$binary_remote_addr` variable’s size is always 4 bytes for IPv4 addresses or 16 bytes for IPv6 addresses. The stored state always occupies 64 bytes on 32-bit platforms and 128 bytes on 64-bit platforms. One megabyte zone can keep about 16 thousand 64-byte states or about 8 thousand 128-byte states.

If the zone storage is exhausted, the least recently used state is removed. If even after that a new state cannot be created, the request is terminated with an [[12-directives/limit-req-status|error]].

The rate is specified in requests per second (r/s). If a rate of less than one request per second is desired, it is specified in request per minute (r/m). For example, half-request per second is 30r/m.

Additionally, the following functionality is available as part of our [abonnement commercial](https://nginx.com/products/):

- The `rate` parameter can contain variables (1.31.3). The rate is evaluated at runtime for each request. Example:

  ```nginx
  map $uri $rate {
      default       10r/s;
      /api/slow     1r/s;
      /api/fast     100r/s;
  }

  limit_req_zone $binary_remote_addr zone=one:10m rate=$rate;
  ```
- The `sync` parameter (1.15.3) enables [[12-directives/zone-sync|synchronization]] of the shared memory zone.
- The [[11-modules/02-http/ngx_http_api_module|status information]] for each such shared memory zone can be [[11-modules/02-http/ngx_http_api_module|obtained]] or [[11-modules/02-http/ngx_http_api_module|reset]] with the [[11-modules/02-http/ngx_http_api_module|API]] since 1.17.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

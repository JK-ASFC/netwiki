---
title: "db_cache"
description: "Directive nginx db_cache (ngx_http_db_module) — Enables caching of database lookup results in a shared memory zone defined by the keyval_zone directive. The cache key is the value of the db_get directive, evaluated for the current request. If a…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_cache zone [timeout=time] [max_size=size] [not_found=on\|off\|time];` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Enables caching of database lookup results in a shared memory zone defined by the [[12-directives/keyval-zone-http-keyval|keyval_zone]] directive. The cache key is the value of the [[12-directives/db-get|db_get]] directive, evaluated for the current request. If a cached result is found, it is returned without connecting to the database server.

The [[12-directives/db-pass|db_pass]] directive must be specified in the same configuration context.

The following parameters are supported:

- **`timeout`=*time***

  sets the lifetime of cached values. The parameter defaults to `0`. A nonzero effective timeout should be configured using this parameter or the zone's `timeout` parameter. With an effective timeout of zero, entries may be removed by unrelated writes to the zone.

- **`max_size`=*size***

  sets the maximum value size eligible for caching. By default, the size is `64k`. Values exceeding this limit are returned to the client but are not cached.

- **`not_found`=`off` | `on` | `time`**

  Enables or disables caching of `not found` results. By default, such results are not cached. The value `on` uses the same timeout as for database values. A time value specifies a separate lifetime for `not found` results.

For example:

```nginx
http {
    keyval_zone zone=db_cache:10m timeout=1m;

    upstream redis_backend {
        db_type redis;
        server  127.0.0.1:6379;
    }

    server {
        location /db/ {
            db_pass redis_backend;
            db_get  $arg_key;

            db_cache db_cache timeout=30s max_size=128k not_found=5s;
        }
    }
}
```

The evaluated [[12-directives/db-get|db_get]] value is used as the cache key. A cached value is returned without contacting the database. A cached missing-key result returns `404 Not Found` if missing-key caching is enabled in the current location. Otherwise, the database is queried.

A zero-length value is a successful result and is distinct from a missing key. Only complete, valid successful responses are cached, together with missing-key results when enabled. Failed, malformed, or incomplete responses are not cached.

Locations sharing a zone must have identical [[12-directives/db-pass|db_pass]], [[12-directives/db-name|db_name]], and [[12-directives/db-auth|db_auth]] settings. A cache zone must not also be used for ordinary keyval data. Missing-key caching cannot be combined with the `not_found` parameter of [[12-directives/db-next-upstream|db_next_upstream]].

A cache lookup error returns `500 Internal Server Error`. Failure to insert a result into the cache does not affect the response.

The directive is inherited from the previous configuration level unless overridden.

> [!NOTE]
> The module does not provide cache invalidation or purge. Database changes may remain invisible until cached entries expire or are evicted. Concurrent cache misses are not combined into a single database request.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

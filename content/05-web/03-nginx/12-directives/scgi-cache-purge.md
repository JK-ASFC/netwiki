---
title: "scgi_cache_purge"
description: "Directive nginx scgi_cache_purge (ngx_http_scgi_module) — Defines conditions under which the request will be considered a cache purge request. If at least one value of the string parameters is not empty and is not equal to “0” then the cache entry with a…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_cache_purge string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.7 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Defines conditions under which the request will be considered a cache purge request. If at least one value of the string parameters is not empty and is not equal to “0” then the cache entry with a corresponding [[12-directives/scgi-cache-key|cache key]] is removed. The result of successful operation is indicated by returning the `204 No Content` response.

If the [[12-directives/scgi-cache-key|cache key]] of a purge request ends with an asterisk (“`*`”), all cache entries matching the wildcard key will be removed from the cache. However, these entries will remain on the disk until they are deleted for either [[12-directives/scgi-cache-path|inactivity]], or processed by the cache purger (1.7.12), or a client attempts to access them.

Exemple de configuration :

```nginx
scgi_cache_path /data/nginx/cache keys_zone=cache_zone:10m;

map $request_method $purge_method {
    PURGE   1;
    default 0;
}

server {
    ...
    location / {
        scgi_pass        backend;
        scgi_cache       cache_zone;
        scgi_cache_key   $uri;
        scgi_cache_purge $purge_method;
    }
}
```

> [!NOTE]
> Cette fonction est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

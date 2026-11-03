---
title: "limit_rate"
description: "Directive nginx limit_rate (ngx_http_core_module) — Limits the rate of response transmission to a client. The rate is specified in bytes per second. The zero value disables rate limiting. The limit is set per a request, and so if a client…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_rate rate;` |
| **Valeur par défaut** | `limit_rate 0;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Limits the rate of response transmission to a client. The *rate* is specified in bytes per second. The zero value disables rate limiting. The limit is set per a request, and so if a client simultaneously opens two connections, the overall rate will be twice as much as the specified limit.

Parameter value can contain variables (1.17.0). It may be useful in cases where rate should be limited depending on a certain condition:

```nginx
map $slow $rate {
    1     4k;
    2     8k;
}

limit_rate $rate;
```

Rate limit can also be set in the [[13-variables/limit-rate|$limit_rate]] variable, however, since version 1.17.0, this method is not recommended:

```nginx
server {

    if ($slow) {
        set $limit_rate 4k;
    }

    ...
}
```

Rate limit can also be set in the `X-Accel-Limit-Rate` header field of a proxied server response. This capability can be disabled using the [[12-directives/proxy-ignore-headers|proxy_ignore_headers]], [[12-directives/fastcgi-ignore-headers|fastcgi_ignore_headers]], [[12-directives/uwsgi-ignore-headers|uwsgi_ignore_headers]], and [[12-directives/scgi-ignore-headers|scgi_ignore_headers]] directives.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

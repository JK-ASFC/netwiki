---
title: "keepalive"
description: "Directive nginx keepalive (ngx_http_upstream_module) — Enables or disables caching of keepalive connections to upstream servers. Since 1.29.7, by default the cache for connections is activated and these connections are not shared between different…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive connections [local];` |
| **Valeur par défaut** | `keepalive 32 local;` |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.1.4 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Enables or disables caching of keepalive connections to upstream servers. Since 1.29.7, by default the cache for connections is activated and these connections are not shared between different [[12-directives/location|locations]].

The `local` parameter (1.29.7) disables sharing of cached keepalive connections across different locations even if the upstream server address matches. If the `local` parameter is not specified, any matching cached connection to the same upstream server can be reused regardless of a location.

The *connections* parameter sets the maximum number of idle keepalive connections to upstream servers that are preserved in the cache of each worker process. When this number is exceeded, the least recently used connections are closed. The zero value disables keepalive connections to upstream servers.

> [!NOTE]
> Since 1.29.7, keepalive connections are enabled by default, with a default limit of *32* connections per each worker process.

> [!NOTE]
> It should be particularly noted that the `keepalive` directive does not limit the total number of connections to upstream servers that an nginx worker process can open. The *connections* parameter should be set to a number small enough to let upstream servers process new incoming connections as well.

> [!NOTE]
> Before 1.29.7, when using load balancing methods other than the default round-robin method, it was necessary to activate them before the `keepalive` directive.

Example configuration of memcached upstream with keepalive connections:

```nginx
upstream memcached_backend {
    server 127.0.0.1:11211;
    server 10.0.0.2:11211;

    keepalive 32;
}

server {
    ...

    location /memcached/ {
        set $memcached_key $uri;
        memcached_pass memcached_backend;
    }

}
```

For HTTP, the [[12-directives/proxy-http-version|proxy_http_version]] directive should be “`1.1`” (by default since 1.29.7) or set to “`2`” and the `Connection` header field should be cleared. This example is for versions prior to 1.29.7:

```nginx
upstream http_backend {
    server 127.0.0.1:8080;

    keepalive 16;
}

server {
    ...

    location /http/ {
        proxy_pass http://http_backend;
        # proxy_http_version 1.1; # before version 1.29.7
        # proxy_set_header Connection ""; # before version 1.29.7
        ...
    }
}
```

> [!NOTE]
> Alternatively, HTTP/1.0 persistent connections can be used by passing the `Connection: Keep-Alive` header field to an upstream server, though this method is not recommended.

For FastCGI servers, it is required to set [[12-directives/fastcgi-keep-conn|fastcgi_keep_conn]] for keepalive connections to work:

```nginx
upstream fastcgi_backend {
    server 127.0.0.1:9000;

    keepalive 8;
}

server {
    ...

    location /fastcgi/ {
        fastcgi_pass fastcgi_backend;
        fastcgi_keep_conn on;
        ...
    }
}
```

> [!NOTE]
> SCGI and uwsgi protocols do not have a notion of keepalive connections.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

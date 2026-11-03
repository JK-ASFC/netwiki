---
title: "limit_conn (ngx_http_limit_conn_module)"
description: "Directive nginx limit_conn (ngx_http_limit_conn_module) — Sets the shared memory zone and the maximum allowed number of connections for a given key value. When this limit is exceeded, the server will return the error in reply to a request. For example, the…"
tags: [nginx, directive, ngx_http_limit_conn_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn zone number;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_limit_conn_module\|ngx_http_limit_conn_module]] |

## Utilisation

Sets the shared memory zone and the maximum allowed number of connections for a given key value. When this limit is exceeded, the server will return the [[12-directives/limit-conn-status|error]] in reply to a request. For example, the directives

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    location /download/ {
        limit_conn addr 1;
    }
```

allow only one connection per an IP address at a time.

> [!NOTE]
> In HTTP/2 and HTTP/3, each concurrent request is considered a separate connection.

There could be several `limit_conn` directives. For example, the following configuration will limit the number of connections to the server per a client IP and, at the same time, the total number of connections to the virtual server:

```nginx
limit_conn_zone $binary_remote_addr zone=perip:10m;
limit_conn_zone $server_name zone=perserver:10m;

server {
    ...
    limit_conn perip 10;
    limit_conn perserver 100;
}
```

These directives are inherited from the previous configuration level if and only if there are no `limit_conn` directives defined on the current level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

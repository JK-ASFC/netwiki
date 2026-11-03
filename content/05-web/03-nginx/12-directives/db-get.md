---
title: "db_get"
description: "Directive nginx db_get (ngx_http_db_module) — Specifies the key to retrieve from the database. The key can contain text, variables, and their combination. An empty key is not allowed. For the Redis backend, the key is passed to the GET command.…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_get key;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Specifies the key to retrieve from the database. The key can contain text, variables, and their combination. An empty key is not allowed.

For the Redis backend, the key is passed to the `GET` command. A successful lookup returns the value as the response body.

```nginx
upstream redis_backend {
    db_type redis;
    server  127.0.0.1:6379;
}

server {
    location /db/ {
        db_pass redis_backend;
        db_get  "user:$arg_id";
    }
}
```

If caching is [[12-directives/db-cache|enabled]], the evaluated key is also used as the cache key.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

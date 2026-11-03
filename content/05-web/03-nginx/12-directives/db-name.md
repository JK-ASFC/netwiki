---
title: "db_name"
description: "Directive nginx db_name (ngx_http_db_module) — Sets the database to use for lookup requests. For the Redis backend, the parameter specifies the database index passed to the SELECT command. If the directive is not specified or its value is empty,…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_name string;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Sets the database to use for lookup requests.

For the Redis backend, the parameter specifies the database index passed to the `SELECT` command. If the directive is not specified or its value is empty, database `0` is used:

```nginx
location /db/ {
    db_pass redis_backend;
    db_name 3;
    db_get  $arg_key;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

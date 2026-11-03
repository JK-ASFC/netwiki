---
title: "db_auth"
description: "Directive nginx db_auth (ngx_http_db_module) — Specifies the password string used to authenticate connections to a database server. An empty value disables authentication. Authentication with a separate username and password arguments is not…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_auth string;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Specifies the password string used to authenticate connections to a database server. An empty value disables authentication. Authentication with a separate username and password arguments is not supported.

```nginx
location /db/ {
    db_pass redis_backend;
    db_auth secret;
    db_get  $arg_key;
}
```

For the Redis backend, the password is passed as a single argument to the `AUTH` command.

The directive is inherited from the previous configuration level if and only if there are no `db_auth` directives defined on the current level.

To protect the password, enable SSL/TLS connections to the database server using the [[12-directives/db-ssl|db_ssl]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

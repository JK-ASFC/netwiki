---
title: "db_type"
description: "Directive nginx db_type (ngx_http_db_module) — Sets the database protocol used by the upstream group. Currently, only redis is supported: nginx upstream redis_backend { server 127.0.0.1:6379; db_type redis; } The protocol name is case-insensitive."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_type type;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Sets the database protocol used by the upstream group. Currently, only `redis` is supported:

```nginx
upstream redis_backend {
    server  127.0.0.1:6379;
    db_type redis;
}
```

The protocol name is case-insensitive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

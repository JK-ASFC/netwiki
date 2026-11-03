---
title: "db_pass"
description: "Directive nginx db_pass (ngx_http_db_module) — Specifies the upstream group used for database lookups: nginx db_pass redis_backend; The group must be configured with db_type. A server address cannot be specified directly. The db_get directive…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_pass name;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Specifies the upstream group used for database lookups:

```nginx
db_pass redis_backend;
```

The group must be configured with [[12-directives/db-type|db_type]]. A server address cannot be specified directly.

The [[12-directives/db-get|db_get]] directive must also be configured, either in the current configuration or inherited from a parent location.

Only `GET` and `HEAD` requests are accepted. Other methods return `405 Method Not Allowed`. The client request body is discarded. Client headers and the request body are not forwarded to the database.

The response content type is determined by the [[12-directives/types|types]] and [[12-directives/default-type|default_type]] directives.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

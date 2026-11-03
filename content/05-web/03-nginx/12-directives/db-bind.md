---
title: "db_bind"
description: "Directive nginx db_bind (ngx_http_db_module) — Makes outgoing connections to a database server originate from the specified local IP address with an optional port. Parameter value can contain variables. The special value off cancels the effect of…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_bind address [transparent] \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Makes outgoing connections to a database server originate from the specified local IP address with an optional port. Parameter value can contain variables. The special value `off` cancels the effect of the `db_bind` directive inherited from the previous configuration level, which allows the system to auto-assign the local IP address and port. Example:

```nginx
db_bind $server_addr;
```

The `transparent` parameter allows outgoing connections to a database server originate from a non-local IP address, for example, from a real IP address of a client:

```nginx
db_bind $remote_addr transparent;
```

In order for this parameter to work, it is usually necessary to run nginx worker processes with the [[12-directives/user|superuser]] privileges. On Linux it is not required as if the `transparent` parameter is specified, worker processes inherit the `CAP_NET_RAW` capability from the master process. It is also necessary to configure kernel routing table to intercept network traffic from the database server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

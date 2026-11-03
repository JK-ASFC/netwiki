---
title: "db_read_timeout"
description: "Directive nginx db_read_timeout (ngx_http_db_module) — Defines a timeout for reading data from a database server. The timeout is set only between two successive read operations, not for the transmission of the whole response. If the database server does…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_read_timeout time;` |
| **Valeur par défaut** | `db_read_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Defines a timeout for reading data from a database server. The timeout is set only between two successive read operations, not for the transmission of the whole response. If the database server does not transmit anything within this time, the connection is closed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

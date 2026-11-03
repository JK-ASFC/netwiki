---
title: "db_connect_timeout"
description: "Directive nginx db_connect_timeout (ngx_http_db_module) — Defines a timeout for establishing a connection with a database server. It should be noted that this timeout cannot usually exceed 75 seconds."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_connect_timeout time;` |
| **Valeur par défaut** | `db_connect_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Defines a timeout for establishing a connection with a database server. It should be noted that this timeout cannot usually exceed 75 seconds.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "db_ssl_name"
description: "Directive nginx db_ssl_name (ngx_http_db_module) — Allows overriding the server name used to verify the database server certificate and to be passed through SNI when establishing a connection with the database server."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_name name;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Allows overriding the server name used to [[12-directives/db-ssl-verify|verify]] the database server certificate and to be [[12-directives/db-ssl-server-name|passed through SNI]] when establishing a connection with the database server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

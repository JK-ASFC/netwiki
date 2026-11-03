---
title: "limit_conn_log_level (ngx_http_limit_conn_module)"
description: "Directive nginx limit_conn_log_level (ngx_http_limit_conn_module) — Sets the desired logging level for cases when the server limits the number of connections."
tags: [nginx, directive, ngx_http_limit_conn_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn_log_level info \| notice \| warn \| error;` |
| **Valeur par défaut** | `limit_conn_log_level error;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.18 |
| **Module** | [[11-modules/02-http/ngx_http_limit_conn_module\|ngx_http_limit_conn_module]] |

## Utilisation

Sets the desired logging level for cases when the server limits the number of connections.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

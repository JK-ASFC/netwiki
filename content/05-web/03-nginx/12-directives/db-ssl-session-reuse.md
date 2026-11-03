---
title: "db_ssl_session_reuse"
description: "Directive nginx db_ssl_session_reuse (ngx_http_db_module) — Determines whether SSL sessions can be reused when working with the database server. If the errors “digest check failed” appear in the logs, try disabling session reuse."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_session_reuse on \| off;` |
| **Valeur par défaut** | `db_ssl_session_reuse on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Determines whether SSL sessions can be reused when working with the database server. If the errors “`digest check failed`” appear in the logs, try disabling session reuse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ssl_session_timeout (ngx_http_ssl_module)"
description: "Directive nginx ssl_session_timeout (ngx_http_ssl_module) — Indique la durée pendant laquelle un client peut réutiliser les paramètres de session. Si la directive est indiquée au niveau server, la valeur du serveur par défaut peut être utilisée. Les détails…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_timeout time;` |
| **Valeur par défaut** | `ssl_session_timeout 5m;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Indique la durée pendant laquelle un client peut réutiliser les paramètres de session.

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

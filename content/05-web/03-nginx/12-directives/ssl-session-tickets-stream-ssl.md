---
title: "ssl_session_tickets (ngx_stream_ssl_module)"
description: "Directive nginx ssl_session_tickets (ngx_stream_ssl_module) — Active ou désactive la reprise de session par tickets de session TLS. Si la directive est indiquée au niveau server, la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_tickets on \| off;` |
| **Valeur par défaut** | `ssl_session_tickets on;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Active ou désactive la reprise de session par [tickets de session TLS](https://datatracker.ietf.org/doc/html/rfc5077).

Si la directive est indiquée au niveau [[12-directives/server-stream-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

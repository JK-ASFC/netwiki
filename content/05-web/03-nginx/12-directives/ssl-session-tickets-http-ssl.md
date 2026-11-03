---
title: "ssl_session_tickets (ngx_http_ssl_module)"
description: "Directive nginx ssl_session_tickets (ngx_http_ssl_module) — Enables or disables session resumption through TLS session tickets. Si la directive est indiquée au niveau server, la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_tickets on \| off;` |
| **Valeur par défaut** | `ssl_session_tickets on;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.5.9 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Enables or disables session resumption through [TLS session tickets](https://datatracker.ietf.org/doc/html/rfc5077).

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

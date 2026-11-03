---
title: "tunnel_read_timeout"
description: "Directive nginx tunnel_read_timeout (ngx_http_tunnel_module) — Sets the timeout between two successive read or write operations on client or backend server connections. If no data is transmitted within this time, the connection is closed."
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_read_timeout time;` |
| **Valeur par défaut** | `tunnel_read_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Sets the timeout between two successive read or write operations on client or backend server connections. If no data is transmitted within this time, the connection is closed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

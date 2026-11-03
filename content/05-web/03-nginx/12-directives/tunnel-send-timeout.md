---
title: "tunnel_send_timeout"
description: "Directive nginx tunnel_send_timeout (ngx_http_tunnel_module) — Sets a timeout for transmitting a request to the backend server. The timeout is set only between two successive write operations, not for the transmission of the whole request. If the backend server…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_send_timeout time;` |
| **Valeur par défaut** | `tunnel_send_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Sets a timeout for transmitting a request to the backend server. The timeout is set only between two successive write operations, not for the transmission of the whole request. If the backend server does not receive anything within this time, the connection is closed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

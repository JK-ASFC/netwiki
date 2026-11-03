---
title: "tunnel_socket_sndbuf"
description: "Directive nginx tunnel_socket_sndbuf (ngx_http_tunnel_module) — Sets the send buffer size (the SO_SNDBUF option) for outgoing connections to a backend server. The special value 0 cancels the effect of the tunnel_socket_sndbuf directive inherited from the previous…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_socket_sndbuf size;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Sets the send buffer size (the `SO_SNDBUF` option) for outgoing connections to a backend server. The special value `0` cancels the effect of the `tunnel_socket_sndbuf` directive inherited from the previous configuration level, which allows keeping the operating system’s settings in effect for the socket.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

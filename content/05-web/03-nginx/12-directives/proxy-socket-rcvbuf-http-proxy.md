---
title: "proxy_socket_rcvbuf (ngx_http_proxy_module)"
description: "Directive nginx proxy_socket_rcvbuf (ngx_http_proxy_module) — Sets the receive buffer size (the SO_RCVBUF option) for outgoing connections to a proxied server. The special value 0 cancels the effect of the proxy_socket_rcvbuf directive inherited from the…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_socket_rcvbuf size;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Sets the receive buffer size (the `SO_RCVBUF` option) for outgoing connections to a proxied server. The special value `0` cancels the effect of the `proxy_socket_rcvbuf` directive inherited from the previous configuration level, which allows keeping the operating system’s settings in effect for the socket.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

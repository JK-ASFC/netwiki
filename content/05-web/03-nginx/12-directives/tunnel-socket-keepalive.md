---
title: "tunnel_socket_keepalive"
description: "Directive nginx tunnel_socket_keepalive (ngx_http_tunnel_module) — Configures the “TCP keepalive” behavior for outgoing connections to a backend server. By default, the operating system’s settings are in effect for the socket. If the directive is set to the value…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_socket_keepalive on \| off;` |
| **Valeur par défaut** | `tunnel_socket_keepalive off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Configures the “TCP keepalive” behavior for outgoing connections to a backend server. By default, the operating system’s settings are in effect for the socket. If the directive is set to the value “`on`”, the `SO_KEEPALIVE` socket option is turned on for the socket.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

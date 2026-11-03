---
title: "tunnel_bind"
description: "Directive nginx tunnel_bind (ngx_http_tunnel_module) — Makes outgoing connections to a backend server originate from the specified local IP address with an optional port. Parameter value can contain variables. The special value off cancels the effect of…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_bind address \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Makes outgoing connections to a backend server originate from the specified local IP address with an optional port. Parameter value can contain variables. The special value `off` cancels the effect of the `tunnel_bind` directive inherited from the previous configuration level, which allows the system to auto-assign the local IP address and port.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

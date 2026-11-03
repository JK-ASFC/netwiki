---
title: "tunnel_connect_timeout"
description: "Directive nginx tunnel_connect_timeout (ngx_http_tunnel_module) — Defines a timeout for establishing a connection with a backend server. It should be noted that this timeout cannot usually exceed 75 seconds."
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_connect_timeout time;` |
| **Valeur par défaut** | `tunnel_connect_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Defines a timeout for establishing a connection with a backend server. It should be noted that this timeout cannot usually exceed 75 seconds.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

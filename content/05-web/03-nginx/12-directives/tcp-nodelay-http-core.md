---
title: "tcp_nodelay (ngx_http_core_module)"
description: "Directive nginx tcp_nodelay (ngx_http_core_module) — Active ou désactive l'option TCP_NODELAY. L'option est activée lorsque la connexion passe à l'état persistant, ainsi que sur les connexions SSL, pour le relais sans tampon et pour le relais WebSocket."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tcp_nodelay on \| off;` |
| **Valeur par défaut** | `tcp_nodelay on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'option `TCP_NODELAY`. L'option est activée lorsque la connexion passe à l'état persistant, ainsi que sur les connexions SSL, pour le relais sans tampon et pour le relais [[10-guides/02-http/websocket|WebSocket]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

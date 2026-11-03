---
title: "tunnel_socket_keepalive"
description: "Directive nginx tunnel_socket_keepalive (ngx_http_tunnel_module) — Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur d'arrière-plan. Par défaut, les réglages du système d'exploitation s'appliquent au socket. Avec la valeur « on »,…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_socket_keepalive on \| off;` |
| **Valeur par défaut** | `tunnel_socket_keepalive off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur d'arrière-plan. Par défaut, les réglages du système d'exploitation s'appliquent au socket. Avec la valeur « `on` », l'option de socket `SO_KEEPALIVE` est activée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

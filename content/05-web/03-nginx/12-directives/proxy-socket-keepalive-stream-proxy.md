---
title: "proxy_socket_keepalive (ngx_stream_proxy_module)"
description: "Directive nginx proxy_socket_keepalive (ngx_stream_proxy_module) — Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur mandaté. Par défaut, les réglages du système d'exploitation s'appliquent au socket. Avec la valeur « on »,…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_socket_keepalive on \| off;` |
| **Valeur par défaut** | `proxy_socket_keepalive off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.6 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur mandaté. Par défaut, les réglages du système d'exploitation s'appliquent au socket. Avec la valeur « `on` », l'option de socket `SO_KEEPALIVE` est activée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

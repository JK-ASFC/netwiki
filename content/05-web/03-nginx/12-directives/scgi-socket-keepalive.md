---
title: "scgi_socket_keepalive"
description: "Directive nginx scgi_socket_keepalive (ngx_http_scgi_module) — Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur SCGI. Par défaut, les réglages du système d'exploitation s'appliquent au socket. Avec la valeur « on », l'option…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_socket_keepalive on \| off;` |
| **Valeur par défaut** | `scgi_socket_keepalive off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.15.6 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur SCGI. Par défaut, les réglages du système d'exploitation s'appliquent au socket. Avec la valeur « `on` », l'option de socket `SO_KEEPALIVE` est activée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

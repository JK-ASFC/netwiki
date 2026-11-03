---
title: "uwsgi_socket_keepalive"
description: "Directive nginx uwsgi_socket_keepalive (ngx_http_uwsgi_module) — Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur uwsgi. Par défaut, les réglages du système d'exploitation s'appliquent au socket. Avec la valeur « on », l'option…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_socket_keepalive on \| off;` |
| **Valeur par défaut** | `uwsgi_socket_keepalive off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.15.6 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur uwsgi. Par défaut, les réglages du système d'exploitation s'appliquent au socket. Avec la valeur « `on` », l'option de socket `SO_KEEPALIVE` est activée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

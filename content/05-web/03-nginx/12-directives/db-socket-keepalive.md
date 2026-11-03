---
title: "db_socket_keepalive"
description: "Directive nginx db_socket_keepalive (ngx_http_db_module) — Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur de base de données. Si cette option est activée, l'option de socket SO_KEEPALIVE est activée. C'est différent du…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_socket_keepalive on \| off;` |
| **Valeur par défaut** | `db_socket_keepalive off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Configure le comportement « TCP keepalive » des connexions sortantes vers un serveur de base de données. Si cette option est activée, l'option de socket `SO_KEEPALIVE` est activée.

C'est différent du cache des connexions amont inactives, configuré avec la directive [[12-directives/keepalive|keepalive]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

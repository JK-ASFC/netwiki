---
title: "port_in_redirect"
description: "Directive nginx port_in_redirect (ngx_http_core_module) — Active ou désactive l'indication du port dans les redirections absolues émises par nginx. L'utilisation du nom de serveur principal dans les redirections est contrôlée par la directive…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `port_in_redirect on \| off;` |
| **Valeur par défaut** | `port_in_redirect on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'indication du port dans les redirections [[12-directives/absolute-redirect|absolues]] émises par nginx.

L'utilisation du nom de serveur principal dans les redirections est contrôlée par la directive [[12-directives/server-name-in-redirect|server_name_in_redirect]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

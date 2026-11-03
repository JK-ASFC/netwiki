---
title: "status_zone (ngx_http_status_module)"
description: "Directive nginx status_zone (ngx_http_status_module) — Active la collecte des informations d'état des serveurs virtuels http ou stream (1.7.11) dans la zone (zone) indiquée. Plusieurs serveurs peuvent partager la même zone."
tags: [nginx, directive, ngx_http_status_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `status_zone zone;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/02-http/ngx_http_status_module\|ngx_http_status_module]] |

## Utilisation

Active la collecte des informations d'état des serveurs virtuels [[12-directives/server-http-core|http]] ou [[12-directives/server-stream-core|stream]] (1.7.11) dans la zone (*zone*) indiquée. Plusieurs serveurs peuvent partager la même zone.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

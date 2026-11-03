---
title: "absolute_redirect"
description: "Directive nginx absolute_redirect (ngx_http_core_module) — Si cette option est désactivée, les redirections émises par nginx sont relatives. Voir aussi les directives server_name_in_redirect et port_in_redirect."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `absolute_redirect on \| off;` |
| **Valeur par défaut** | `absolute_redirect on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.11.8 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Si cette option est désactivée, les redirections émises par nginx sont relatives.

Voir aussi les directives [[12-directives/server-name-in-redirect|server_name_in_redirect]] et [[12-directives/port-in-redirect|port_in_redirect]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

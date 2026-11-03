---
title: "limit_zone"
description: "Directive nginx limit_zone (ngx_http_limit_conn_module) — Cette directive est devenue obsolète en version 1.1.8 et a été supprimée en version 1.7.6. Utiliser à la place la directive équivalente limit_conn_zone, dont la syntaxe a changé : NOTE…"
tags: [nginx, directive, ngx_http_limit_conn_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_zone name $variable size;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_limit_conn_module\|ngx_http_limit_conn_module]] |

## Utilisation

Cette directive est devenue obsolète en version 1.1.8 et a été supprimée en version 1.7.6. Utiliser à la place la directive équivalente [[12-directives/limit-conn-zone-http-limit-conn|limit_conn_zone]], dont la syntaxe a changé :

> [!NOTE]
> `limit_conn_zone` *$variable* `zone`=*name*:*size*;

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "$upstream_queue_time"
description: "Variable nginx $upstream_queue_time (ngx_http_upstream_module) — contient la durée passée par la requête dans la file d'attente du groupe amont (1.13.9), en secondes avec une résolution à la milliseconde. Les durées de plusieurs réponses sont séparées par des…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_queue_time` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

contient la durée passée par la requête dans la [[12-directives/queue|file d'attente]] du groupe amont (1.13.9), en secondes avec une résolution à la milliseconde. Les durées de plusieurs réponses sont séparées par des virgules et des deux-points, comme les adresses de la variable [[13-variables/upstream-addr-http-upstream|$upstream_addr]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

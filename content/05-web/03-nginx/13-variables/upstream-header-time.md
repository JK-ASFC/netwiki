---
title: "$upstream_header_time"
description: "Variable nginx $upstream_header_time (ngx_http_upstream_module) — contient la durée de réception de l'en-tête de réponse du serveur amont (1.7.10), en secondes avec une résolution à la milliseconde. Les durées de plusieurs réponses sont séparées par des virgules et…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_header_time` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

contient la durée de réception de l'en-tête de réponse du serveur amont (1.7.10), en secondes avec une résolution à la milliseconde. Les durées de plusieurs réponses sont séparées par des virgules et des deux-points, comme les adresses de la variable [[13-variables/upstream-addr-http-upstream|$upstream_addr]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

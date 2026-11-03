---
title: "$upstream_connect_time (ngx_http_upstream_module)"
description: "Variable nginx $upstream_connect_time (ngx_http_upstream_module) — contient la durée d'établissement de la connexion avec le serveur amont (1.9.1), en secondes avec une résolution à la milliseconde. En SSL, elle inclut la durée de la négociation. Les durées de…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_connect_time` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

contient la durée d'établissement de la connexion avec le serveur amont (1.9.1), en secondes avec une résolution à la milliseconde. En SSL, elle inclut la durée de la négociation. Les durées de plusieurs connexions sont séparées par des virgules et des deux-points, comme les adresses de la variable [[13-variables/upstream-addr-http-upstream|$upstream_addr]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "$upstream_status"
description: "Variable nginx $upstream_status (ngx_http_upstream_module) — contient le code de statut de la réponse obtenue du serveur amont. Les codes de plusieurs réponses sont séparés par des virgules et des deux-points, comme les adresses de la variable $upstream_addr.…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_status` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

contient le code de statut de la réponse obtenue du serveur amont. Les codes de plusieurs réponses sont séparés par des virgules et des deux-points, comme les adresses de la variable [[13-variables/upstream-addr-http-upstream|$upstream_addr]]. Si aucun serveur ne peut être choisi, la variable contient le code de statut `502 Bad Gateway`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

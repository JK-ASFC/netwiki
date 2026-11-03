---
title: "$proxy_add_x_forwarded_for"
description: "Variable nginx $proxy_add_x_forwarded_for (ngx_http_proxy_module) — le champ d'en-tête de requête du client X-Forwarded-For, suivi de la variable $remote_addr, séparés par une virgule. Si le champ X-Forwarded-For est absent de l'en-tête de la requête du client, la…"
tags: [nginx, variable, ngx_http_proxy_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$proxy_add_x_forwarded_for` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

le champ d'en-tête de requête du client `X-Forwarded-For`, suivi de la variable `$remote_addr`, séparés par une virgule. Si le champ `X-Forwarded-For` est absent de l'en-tête de la requête du client, la variable `$proxy_add_x_forwarded_for` est égale à la variable `$remote_addr`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

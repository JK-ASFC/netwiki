---
title: "$proxy_protocol_server_addr (ngx_http_core_module)"
description: "Variable nginx $proxy_protocol_server_addr (ngx_http_core_module) — adresse du serveur issue de l'en-tête du protocole PROXY (1.17.6) Le protocole PROXY doit au préalable être activé avec le paramètre proxy_protocol de la directive listen."
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$proxy_protocol_server_addr` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

adresse du serveur issue de l'en-tête du protocole PROXY (1.17.6)

Le protocole PROXY doit au préalable être activé avec le paramètre `proxy_protocol` de la directive [[12-directives/listen-http-core|listen]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

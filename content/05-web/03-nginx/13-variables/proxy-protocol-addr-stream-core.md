---
title: "$proxy_protocol_addr (ngx_stream_core_module)"
description: "Variable nginx $proxy_protocol_addr (ngx_stream_core_module) — adresse du client issue de l'en-tête du protocole PROXY (1.11.4) Le protocole PROXY doit au préalable être activé avec le paramètre proxy_protocol de la directive listen."
tags: [nginx, variable, ngx_stream_core_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$proxy_protocol_addr` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

adresse du client issue de l'en-tête du protocole PROXY (1.11.4)

Le protocole PROXY doit au préalable être activé avec le paramètre `proxy_protocol` de la directive [[12-directives/listen-stream-core|listen]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "$request_port"
description: "Variable nginx $request_port (ngx_http_core_module) — dans cet ordre de priorité : numéro de port de la composante « autorité » de l'URI, sinon numéro de port du champ d'en-tête de requête Host (1.29.3)"
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$request_port` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

dans cet ordre de priorité : numéro de port de la composante « autorité » de l'[URI](https://datatracker.ietf.org/doc/html/rfc9110#section-4.2.1), sinon numéro de port du champ d'en-tête de requête `Host` (1.29.3)

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

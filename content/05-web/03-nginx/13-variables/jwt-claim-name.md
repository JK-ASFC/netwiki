---
title: "$jwt_claim_name"
description: "Variable nginx $jwt_claim_name (ngx_http_auth_jwt_module) — renvoie la valeur de la revendication JWT indiquée Pour les revendications imbriquées ou contenant un point (« . »), la valeur de la variable ne peut pas être évaluée ; utiliser plutôt la directive…"
tags: [nginx, variable, ngx_http_auth_jwt_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$jwt_claim_name` |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

renvoie la valeur de la [revendication JWT](https://datatracker.ietf.org/doc/html/rfc7519#section-4) indiquée

Pour les revendications imbriquées ou contenant un point (« . »), la valeur de la variable ne peut pas être évaluée ; utiliser plutôt la directive [[12-directives/auth-jwt-claim-set|auth_jwt_claim_set]].

Les valeurs des variables des jetons chiffrés avec JWE ne sont disponibles qu'après déchiffrement, qui a lieu pendant la phase [[10-guides/06-developpement/development-guide|Access]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

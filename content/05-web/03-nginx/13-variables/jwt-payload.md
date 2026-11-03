---
title: "$jwt_payload"
description: "Variable nginx $jwt_payload (ngx_http_auth_jwt_module) — renvoie la charge utile de premier niveau déchiffrée des jetons nested ou encrypted (1.21.2). Pour les jetons imbriqués, renvoie le jeton JWS contenu ; pour les jetons chiffrés, un JSON contenant les…"
tags: [nginx, variable, ngx_http_auth_jwt_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$jwt_payload` |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

renvoie la charge utile de premier niveau déchiffrée des jetons `nested` ou `encrypted` (1.21.2). Pour les jetons imbriqués, renvoie le jeton JWS contenu ; pour les jetons chiffrés, un JSON contenant les revendications.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "$jwt_claim_name"
description: "Variable nginx $jwt_claim_name (ngx_http_auth_jwt_module) — returns the value of a specified JWT claim For nested claims and claims including a dot (“.”), the value of the variable cannot be evaluated; the auth_jwt_claim_set directive should be used instead.…"
tags: [nginx, variable, ngx_http_auth_jwt_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$jwt_claim_name` |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

returns the value of a specified [JWT claim](https://datatracker.ietf.org/doc/html/rfc7519#section-4)

For nested claims and claims including a dot (“.”), the value of the variable cannot be evaluated; the [[12-directives/auth-jwt-claim-set|auth_jwt_claim_set]] directive should be used instead.

Variable values for tokens encrypted with JWE are available only after decryption which occurs during the [[10-guides/06-developpement/development-guide|Access]] phase.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

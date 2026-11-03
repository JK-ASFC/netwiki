---
title: "$jwt_payload"
description: "Variable nginx $jwt_payload (ngx_http_auth_jwt_module) — returns the decrypted top-level payload of nested or encrypted tokens (1.21.2). For nested tokens returns the enclosed JWS token. For encrypted tokens returns JSON with claims."
tags: [nginx, variable, ngx_http_auth_jwt_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$jwt_payload` |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

returns the decrypted top-level payload of `nested` or `encrypted` tokens (1.21.2). For nested tokens returns the enclosed JWS token. For encrypted tokens returns JSON with claims.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "auth_jwt_require"
description: "Directive nginx auth_jwt_require (ngx_http_auth_jwt_module) — Specifies additional checks for JWT validation. The value can contain text, variables, and their combination, and must start with a variable (1.21.7). The authentication will succeed only if all the…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_require $value ... [error=401 \| 403];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Apparue dans la version** | 1.21.2 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Specifies additional checks for JWT validation. The value can contain text, variables, and their combination, and must start with a variable (1.21.7). The authentication will succeed only if all the values are not empty and are not equal to “0”.

```nginx
map $jwt_claim_iss $valid_jwt_iss {
    "good" 1;
}
...

auth_jwt_require $valid_jwt_iss;
```

If any of the checks fails, the `401` error code is returned. The optional `error` parameter (1.21.7) allows redefining the error code to `403`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

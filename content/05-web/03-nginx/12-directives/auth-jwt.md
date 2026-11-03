---
title: "auth_jwt"
description: "Directive nginx auth_jwt (ngx_http_auth_jwt_module) — Enables validation of JSON Web Token. The specified string is used as a realm. Parameter value can contain variables. The optional token parameter specifies a variable that contains JSON Web Token.…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt string [token=$variable] \| off;` |
| **Valeur par défaut** | `auth_jwt off;` |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Enables validation of JSON Web Token. The specified *string* is used as a `realm`. Parameter value can contain variables.

The optional `token` parameter specifies a variable that contains JSON Web Token. By default, JWT is passed in the `Authorization` header as a [Bearer Token](https://datatracker.ietf.org/doc/html/rfc6750). JWT may be also passed as a cookie or a part of a query string:

```nginx
auth_jwt "closed site" token=$cookie_auth_token;
```

The special value `off` cancels the effect of the `auth_jwt` directive inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "$oidc_claim_name"
description: "Variable nginx $oidc_claim_name (ngx_http_oidc_module) — top-level ID token or UserInfo claim Nested claims can be fetched with the auth_jwt module: nginx http { auth_jwt_claim_set $postal_code address postal_code; server { location / { auth_oidc my_idp;…"
tags: [nginx, variable, ngx_http_oidc_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$oidc_claim_name` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

top-level ID token or UserInfo claim

Nested claims can be fetched with the [[11-modules/02-http/ngx_http_auth_jwt_module|auth_jwt]] module:

```nginx
http {
    auth_jwt_claim_set $postal_code address postal_code;

    server {
        location / {
            auth_oidc my_idp;
            auth_jwt  off token=$oidc_id_token;

            proxy_set_header x-postal_code $postal_code;
            proxy_pass       http://backend;
        }
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "$oidc_claim_name"
description: "Variable nginx $oidc_claim_name (ngx_http_oidc_module) — revendication de premier niveau du jeton d'identité ou de UserInfo Les revendications imbriquées peuvent être récupérées avec le module auth_jwt : nginx http { auth_jwt_claim_set $postal_code address…"
tags: [nginx, variable, ngx_http_oidc_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$oidc_claim_name` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

revendication de premier niveau du jeton d'identité ou de UserInfo

Les revendications imbriquées peuvent être récupérées avec le module [[11-modules/02-http/ngx_http_auth_jwt_module|auth_jwt]] :

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

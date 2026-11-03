---
title: "ngx_http_internal_redirect_module"
description: "Module nginx ngx_http_internal_redirect_module — The ngx_http_internal_redirect_module module (1.23.4) allows making an internal redirect. In contrast to rewriting URIs, the redirection is made after checking request and connection processing limits, and access limits."
tags: [nginx, module, ngx_http_internal_redirect_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_internal_redirect_module` module (1.23.4) allows making an internal redirect. In contrast to [[11-modules/02-http/ngx_http_rewrite_module|rewriting URIs]], the redirection is made after checking [[11-modules/02-http/ngx_http_limit_req_module|request]] and [[11-modules/02-http/ngx_http_limit_conn_module|connection]] processing limits, and [[11-modules/02-http/ngx_http_access_module|access]] limits.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
limit_req_zone $jwt_claim_sub zone=jwt_sub:10m rate=1r/s;

server {
    location / {
        auth_jwt          "realm";
        auth_jwt_key_file key.jwk;

        internal_redirect @rate_limited;
    }

    location @rate_limited {
        internal;

        limit_req  zone=jwt_sub burst=10;
        proxy_pass http://backend;
    }
}
```

The example implements [per-user](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.2) [[11-modules/02-http/ngx_http_limit_req_module|rate limiting]]. Implementation without [[12-directives/internal-redirect|internal_redirect]] is vulnerable to DoS attacks by unsigned JWTs, as normally the [[12-directives/limit-req|limit_req]] check is performed [[10-guides/06-developpement/development-guide|before]] [[12-directives/auth-jwt|auth_jwt]] check. Using [[12-directives/internal-redirect|internal_redirect]] allows reordering these checks.

## Directives

- [[12-directives/internal-redirect|internal_redirect]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

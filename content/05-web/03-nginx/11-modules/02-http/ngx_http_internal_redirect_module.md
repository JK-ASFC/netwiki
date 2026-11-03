---
title: "ngx_http_internal_redirect_module"
description: "Module nginx ngx_http_internal_redirect_module — Le module ngx_http_internal_redirect_module (1.23.4) permet d'effectuer une redirection interne. Contrairement à la réécriture d'URI, la redirection a lieu après la vérification des limites de traitement des requêtes et…"
tags: [nginx, module, ngx_http_internal_redirect_module]
icon: puzzle
---

Le module `ngx_http_internal_redirect_module` (1.23.4) permet d'effectuer une redirection interne. Contrairement à la [[11-modules/02-http/ngx_http_rewrite_module|réécriture d'URI]], la redirection a lieu après la vérification des limites de traitement des [[11-modules/02-http/ngx_http_limit_req_module|requêtes]] et des [[11-modules/02-http/ngx_http_limit_conn_module|connexions]] et des limites d'[[11-modules/02-http/ngx_http_access_module|accès]].

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

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

L'exemple met en œuvre une [[11-modules/02-http/ngx_http_limit_req_module|limitation de débit]] [par utilisateur](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.2). Sans [[12-directives/internal-redirect|internal_redirect]], la mise en œuvre est vulnérable aux attaques par déni de service avec des JWT non signés, car la vérification [[12-directives/limit-req|limit_req]] a normalement lieu [[10-guides/06-developpement/development-guide|avant]] la vérification [[12-directives/auth-jwt|auth_jwt]]. [[12-directives/internal-redirect|internal_redirect]] permet de réordonner ces vérifications.

## Directives

- [[12-directives/internal-redirect|internal_redirect]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

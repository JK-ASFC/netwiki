---
title: "ngx_http_auth_request_module"
description: "Module nginx ngx_http_auth_request_module — Le module ngx_http_auth_request_module (1.5.4+) autorise les clients selon le résultat d'une sous-requête. Si la sous-requête renvoie un code 2xx, l'accès est autorisé. Si elle renvoie 401 ou 403, l'accès est refusé…"
tags: [nginx, module, ngx_http_auth_request_module]
icon: puzzle
---

Le module `ngx_http_auth_request_module` (1.5.4+) autorise les clients selon le résultat d'une sous-requête. Si la sous-requête renvoie un code 2xx, l'accès est autorisé. Si elle renvoie 401 ou 403, l'accès est refusé avec le code d'erreur correspondant. Tout autre code renvoyé par la sous-requête est considéré comme une erreur.

Pour l'erreur 401, le client reçoit aussi l'en-tête `WWW-Authenticate` de la réponse de la sous-requête.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_auth_request_module`.

Le module peut être combiné avec d'autres modules d'accès, comme [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]], [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]] et [[11-modules/02-http/ngx_http_auth_jwt_module|ngx_http_auth_jwt_module]], à l'aide de la directive [[12-directives/satisfy|satisfy]].

> [!NOTE]
> Avant la version 1.7.3, les réponses aux sous-requêtes d'autorisation ne pouvaient pas être mises en cache (avec [[12-directives/proxy-cache|proxy_cache]], [[12-directives/proxy-store|proxy_store]], etc.).

## Exemple de configuration

```nginx
location /private/ {
    auth_request /auth;
    ...
}

location = /auth {
    proxy_pass ...
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
}
```

## Directives

- [[12-directives/auth-request|auth_request]]
- [[12-directives/auth-request-set|auth_request_set]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

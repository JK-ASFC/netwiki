---
title: "ngx_http_auth_basic_module"
description: "Module nginx ngx_http_auth_basic_module — Le module ngx_http_auth_basic_module permet de limiter l'accès aux ressources en vérifiant le nom d'utilisateur et le mot de passe selon le protocole « HTTP Basic Authentication »."
tags: [nginx, module, ngx_http_auth_basic_module]
icon: puzzle
---

Le module `ngx_http_auth_basic_module` permet de limiter l'accès aux ressources en vérifiant le nom d'utilisateur et le mot de passe selon le protocole « HTTP Basic Authentication ».

L'accès peut aussi être limité par [[11-modules/02-http/ngx_http_access_module|adresse]], par le [[11-modules/02-http/ngx_http_auth_request_module|résultat d'une sous-requête]] ou par [[11-modules/02-http/ngx_http_auth_jwt_module|JWT]]. La limitation simultanée par adresse et par mot de passe est contrôlée par la directive [[12-directives/satisfy|satisfy]].

## Exemple de configuration

```nginx
location / {
    auth_basic           "closed site";
    auth_basic_user_file conf/htpasswd;
}
```

## Directives

- [[12-directives/auth-basic|auth_basic]]
- [[12-directives/auth-basic-user-file|auth_basic_user_file]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

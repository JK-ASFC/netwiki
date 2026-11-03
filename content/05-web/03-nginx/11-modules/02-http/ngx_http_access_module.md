---
title: "ngx_http_access_module"
description: "Module nginx ngx_http_access_module — Le module ngx_http_access_module permet de limiter l'accès à certaines adresses de clients."
tags: [nginx, module, ngx_http_access_module]
icon: puzzle
---

Le module `ngx_http_access_module` permet de limiter l'accès à certaines adresses de clients.

L'accès peut aussi être limité par [[11-modules/02-http/ngx_http_auth_basic_module|mot de passe]], par le [[11-modules/02-http/ngx_http_auth_request_module|résultat d'une sous-requête]] ou par [[11-modules/02-http/ngx_http_auth_jwt_module|JWT]]. La limitation simultanée par adresse et par mot de passe est contrôlée par la directive [[12-directives/satisfy|satisfy]].

## Exemple de configuration

```nginx
location / {
    deny  192.168.1.1;
    allow 192.168.1.0/24;
    allow 10.1.1.0/16;
    allow 2001:0db8::/32;
    deny  all;
}
```

Les règles sont vérifiées dans l'ordre jusqu'à la première correspondance. Dans cet exemple, l'accès est autorisé uniquement pour les réseaux IPv4 `10.1.1.0/16` et `192.168.1.0/24`, sauf l'adresse `192.168.1.1`, et pour le réseau IPv6 `2001:0db8::/32`. Lorsque les règles sont nombreuses, il est préférable d'utiliser les variables du module [[11-modules/02-http/ngx_http_geo_module|ngx_http_geo_module]].

## Directives

- [[12-directives/allow-http-access|allow]]
- [[12-directives/deny-http-access|deny]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

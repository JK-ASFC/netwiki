---
title: "ngx_http_upstream_conf_module"
description: "Module nginx ngx_http_upstream_conf_module — Le module ngx_http_upstream_conf_module permet de configurer à chaud les groupes de serveurs amont par une interface HTTP simple, sans redémarrer nginx. Le groupe de serveurs http ou stream doit être en mémoire partagée."
tags: [nginx, module, ngx_http_upstream_conf_module]
icon: puzzle
---

Le module `ngx_http_upstream_conf_module` permet de configurer à chaud les groupes de serveurs amont par une interface HTTP simple, sans redémarrer nginx. Le groupe de serveurs [[12-directives/zone-http-upstream|http]] ou [[12-directives/zone-stream-upstream|stream]] doit être en mémoire partagée.

> [!NOTE]
> Ce module était disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/) jusqu'à la version 1.13.10. Il a été remplacé par le module [[11-modules/02-http/ngx_http_api_module|ngx_http_api_module]] en version 1.13.3.

## Exemple de configuration

```nginx
upstream backend {
    zone upstream_backend 64k;

    ...
}

server {
    location /upstream_conf {
        upstream_conf;
        allow 127.0.0.1;
        deny all;
    }
}
```

## Directives

- [[12-directives/upstream-conf|upstream_conf]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

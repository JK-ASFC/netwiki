---
title: "ngx_stream_keyval_module"
description: "Module nginx ngx_stream_keyval_module — Le module ngx_stream_keyval_module (1.13.7) crée des variables dont les valeurs proviennent de paires clé-valeur gérées par l'API ou d'une variable qui peut aussi être définie avec njs."
tags: [nginx, module, ngx_stream_keyval_module]
icon: puzzle
---

Le module `ngx_stream_keyval_module` (1.13.7) crée des variables dont les valeurs proviennent de paires clé-valeur gérées par l'[[11-modules/02-http/ngx_http_api_module|API]] ou d'une variable qui peut aussi être définie avec [njs](https://github.com/nginx/njs-examples/).

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
http {

    server {
        ...
        location /api {
            api write=on;
        }
    }
}

stream {

    keyval_zone zone=one:32k state=/var/lib/nginx/state/one.keyval;
    keyval      $ssl_server_name $name zone=one;

    server {
        listen              12345 ssl;
        proxy_pass          $name;
        ssl_certificate     /usr/local/nginx/conf/cert.pem;
        ssl_certificate_key /usr/local/nginx/conf/cert.key;
    }
}
```

## Directives

- [[12-directives/keyval-stream-keyval|keyval]]
- [[12-directives/keyval-zone-stream-keyval|keyval_zone]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

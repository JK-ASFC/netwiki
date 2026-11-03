---
title: "ngx_http_keyval_module"
description: "Module nginx ngx_http_keyval_module — Le module ngx_http_keyval_module (1.13.3) crée des variables dont la valeur provient de paires clé-valeur gérées par l'API ou par une variable (1.15.10), également modifiable avec njs."
tags: [nginx, module, ngx_http_keyval_module]
icon: puzzle
---

Le module `ngx_http_keyval_module` (1.13.3) crée des variables dont la valeur provient de paires clé-valeur gérées par l'[[11-modules/02-http/ngx_http_api_module|API]] ou par une variable (1.15.10), également modifiable avec [njs](https://github.com/nginx/njs-examples/#logging-the-number-of-requests-per-client-http-logging-num-requests).

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
http {

    keyval_zone zone=one:32k state=/var/lib/nginx/state/one.keyval;
    keyval $arg_text $text zone=one;
    ...
    server {
        ...
        location / {
            return 200 $text;
        }

        location /api {
            api write=on;
        }
    }
}
```

## Directives

- [[12-directives/keyval-http-keyval|keyval]]
- [[12-directives/keyval-zone-http-keyval|keyval_zone]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

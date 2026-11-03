---
title: "ngx_http_keyval_module"
description: "Module nginx ngx_http_keyval_module — The ngx_http_keyval_module module (1.13.3) creates variables with values taken from key-value pairs managed by the API or a variable (1.15.10) that can also be set with njs."
tags: [nginx, module, ngx_http_keyval_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_keyval_module` module (1.13.3) creates variables with values taken from key-value pairs managed by the [[11-modules/02-http/ngx_http_api_module|API]] or a variable (1.15.10) that can also be set with [njs](https://github.com/nginx/njs-examples/#logging-the-number-of-requests-per-client-http-logging-num-requests).

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

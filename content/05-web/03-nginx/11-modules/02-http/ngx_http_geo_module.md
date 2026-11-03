---
title: "ngx_http_geo_module"
description: "Module nginx ngx_http_geo_module — Le module ngx_http_geo_module crée des variables dont la valeur dépend de l'adresse IP du client."
tags: [nginx, module, ngx_http_geo_module]
icon: puzzle
---

Le module `ngx_http_geo_module` crée des variables dont la valeur dépend de l'adresse IP du client.

## Exemple de configuration

```nginx
geo $geo {
    default        0;

    127.0.0.1      2;
    192.168.1.0/24 1;
    10.1.0.0/16    1;

    ::1            2;
    2001:0db8::/32 1;
}
```

## Directives

- [[12-directives/geo-http-geo|geo]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_stream_geo_module"
description: "Module nginx ngx_stream_geo_module — Le module ngx_stream_geo_module (1.11.3) crée des variables dont les valeurs dépendent de l'adresse IP du client."
tags: [nginx, module, ngx_stream_geo_module]
icon: puzzle
---

Le module `ngx_stream_geo_module` (1.11.3) crée des variables dont les valeurs dépendent de l'adresse IP du client.

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

- [[12-directives/geo-stream-geo|geo]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

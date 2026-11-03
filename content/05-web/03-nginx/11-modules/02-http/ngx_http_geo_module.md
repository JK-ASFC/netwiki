---
title: "ngx_http_geo_module"
description: "Module nginx ngx_http_geo_module — The ngx_http_geo_module module creates variables with values depending on the client IP address."
tags: [nginx, module, ngx_http_geo_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_geo_module` module creates variables with values depending on the client IP address.

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

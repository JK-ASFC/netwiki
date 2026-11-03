---
title: "ngx_http_num_map_module"
description: "Module nginx ngx_http_num_map_module — The ngx_http_num_map_module module (1.29.3) creates variables whose values depend on numeric values or numeric value ranges."
tags: [nginx, module, ngx_http_num_map_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_num_map_module` module (1.29.3) creates variables whose values depend on numeric values or numeric value ranges.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
num_map $remote_port $port_allow {
    default    0;

    80         1;
    443        1;
    <=1023     0;
    8080-8090  1;
}
```

## Directives

- [[12-directives/num-map-http-num-map|num_map]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

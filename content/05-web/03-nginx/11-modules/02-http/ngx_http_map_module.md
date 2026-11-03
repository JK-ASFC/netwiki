---
title: "ngx_http_map_module"
description: "Module nginx ngx_http_map_module — The ngx_http_map_module module creates variables whose values depend on values of other variables."
tags: [nginx, module, ngx_http_map_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_map_module` module creates variables whose values depend on values of other variables.

## Example Configuration

```nginx
map $http_host $name {
    hostnames;

    default       0;

    example.com   1;
    *.example.com 1;
    example.org   2;
    *.example.org 2;
    .example.net  3;
    wap.*         4;
}

map $http_user_agent $mobile {
    default       0;
    "~Opera Mini" 1;
}
```

## Directives

- [[12-directives/map-http-map|map]]
- [[12-directives/map-hash-bucket-size-http-map|map_hash_bucket_size]]
- [[12-directives/map-hash-max-size-http-map|map_hash_max_size]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

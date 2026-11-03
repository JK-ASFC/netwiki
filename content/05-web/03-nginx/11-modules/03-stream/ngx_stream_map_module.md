---
title: "ngx_stream_map_module"
description: "Module nginx ngx_stream_map_module — The ngx_stream_map_module module (1.11.2) creates variables whose values depend on values of other variables."
tags: [nginx, module, ngx_stream_map_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_map_module` module (1.11.2) creates variables whose values depend on values of other variables.

## Exemple de configuration

```nginx
map $remote_addr $limit {
    127.0.0.1    "";
    default      $binary_remote_addr;
}

limit_conn_zone $limit zone=addr:10m;
limit_conn addr 1;
```

## Directives

- [[12-directives/map-stream-map|map]]
- [[12-directives/map-hash-bucket-size-stream-map|map_hash_bucket_size]]
- [[12-directives/map-hash-max-size-stream-map|map_hash_max_size]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

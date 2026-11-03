---
title: "ngx_http_random_index_module"
description: "Module nginx ngx_http_random_index_module — The ngx_http_random_index_module module processes requests ending with the slash character (‘/’) and picks a random file in a directory to serve as an index file. The module is processed before the ngx_http_index_module…"
tags: [nginx, module, ngx_http_random_index_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_random_index_module` module processes requests ending with the slash character (‘`/`’) and picks a random file in a directory to serve as an index file. The module is processed before the [[11-modules/02-http/ngx_http_index_module|ngx_http_index_module]] module.

This module is not built by default, it should be enabled with the `--with-http_random_index_module` configuration parameter.

## Example Configuration

```nginx
location / {
    random_index on;
}
```

## Directives

- [[12-directives/random-index|random_index]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_http_index_module"
description: "Module nginx ngx_http_index_module — The ngx_http_index_module module processes requests ending with the slash character (‘/’). Such requests can also be processed by the ngx_http_autoindex_module and ngx_http_random_index_module modules."
tags: [nginx, module, ngx_http_index_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_index_module` module processes requests ending with the slash character (‘`/`’). Such requests can also be processed by the [[11-modules/02-http/ngx_http_autoindex_module|ngx_http_autoindex_module]] and [[11-modules/02-http/ngx_http_random_index_module|ngx_http_random_index_module]] modules.

## Example Configuration

```nginx
location / {
    index index.$geo.html index.html;
}
```

## Directives

- [[12-directives/index|index]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_http_autoindex_module"
description: "Module nginx ngx_http_autoindex_module — The ngx_http_autoindex_module module processes requests ending with the slash character (‘/’) and produces a directory listing. Usually a request is passed to the ngx_http_autoindex_module module when the…"
tags: [nginx, module, ngx_http_autoindex_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_autoindex_module` module processes requests ending with the slash character (‘`/`’) and produces a directory listing. Usually a request is passed to the `ngx_http_autoindex_module` module when the [[11-modules/02-http/ngx_http_index_module|ngx_http_index_module]] module cannot find an index file.

## Example Configuration

```nginx
location / {
    autoindex on;
}
```

## Directives

- [[12-directives/autoindex|autoindex]]
- [[12-directives/autoindex-exact-size|autoindex_exact_size]]
- [[12-directives/autoindex-format|autoindex_format]]
- [[12-directives/autoindex-localtime|autoindex_localtime]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

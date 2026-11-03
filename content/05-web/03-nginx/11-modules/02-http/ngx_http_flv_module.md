---
title: "ngx_http_flv_module"
description: "Module nginx ngx_http_flv_module — The ngx_http_flv_module module provides pseudo-streaming server-side support for Flash Video (FLV) files."
tags: [nginx, module, ngx_http_flv_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_flv_module` module provides pseudo-streaming server-side support for Flash Video (FLV) files.

It handles requests with the `start` argument in the request URI’s query string specially, by sending back the contents of a file starting from the requested byte offset and with the prepended FLV header.

This module is not built by default, it should be enabled with the `--with-http_flv_module` configuration parameter.

## Example Configuration

```nginx
location ~ \.flv$ {
    flv;
}
```

## Directives

- [[12-directives/flv|flv]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

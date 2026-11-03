---
title: "ngx_http_gunzip_module"
description: "Module nginx ngx_http_gunzip_module — The ngx_http_gunzip_module module is a filter that decompresses responses with “Content-Encoding: gzip” for clients that do not support “gzip” encoding method. The module will be useful when it is desirable to store…"
tags: [nginx, module, ngx_http_gunzip_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_gunzip_module` module is a filter that decompresses responses with “`Content-Encoding: gzip`” for clients that do not support “gzip” encoding method. The module will be useful when it is desirable to store data compressed to save space and reduce I/O costs.

This module is not built by default, it should be enabled with the `--with-http_gunzip_module` configuration parameter.

## Example Configuration

```nginx
location /storage/ {
    gunzip on;
    ...
}
```

## Directives

- [[12-directives/gunzip|gunzip]]
- [[12-directives/gunzip-buffers|gunzip_buffers]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

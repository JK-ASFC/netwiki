---
title: "ngx_http_gzip_static_module"
description: "Module nginx ngx_http_gzip_static_module — The ngx_http_gzip_static_module module allows sending precompressed files with the “.gz” filename extension instead of regular files."
tags: [nginx, module, ngx_http_gzip_static_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_gzip_static_module` module allows sending precompressed files with the “`.gz`” filename extension instead of regular files.

This module is not built by default, it should be enabled with the `--with-http_gzip_static_module` configuration parameter.

## Example Configuration

```nginx
gzip_static  on;
gzip_proxied expired no-cache no-store private auth;
```

## Directives

- [[12-directives/gzip-static|gzip_static]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_http_gzip_module"
description: "Module nginx ngx_http_gzip_module — The ngx_http_gzip_module module is a filter that compresses responses using the “gzip” method. This often helps to reduce the size of transmitted data by half or even more."
tags: [nginx, module, ngx_http_gzip_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_gzip_module` module is a filter that compresses responses using the “gzip” method. This often helps to reduce the size of transmitted data by half or even more.

> [!NOTE]
> When using the SSL/TLS protocol, compressed responses may be subject to [BREACH](https://en.wikipedia.org/wiki/BREACH) attacks.

## Example Configuration

```nginx
gzip            on;
gzip_min_length 1000;
gzip_proxied    expired no-cache no-store private auth;
gzip_types      text/plain application/xml;
```

The `$gzip_ratio` variable can be used to log the achieved compression ratio.

## Directives

- [[12-directives/gzip|gzip]]
- [[12-directives/gzip-buffers|gzip_buffers]]
- [[12-directives/gzip-comp-level|gzip_comp_level]]
- [[12-directives/gzip-disable|gzip_disable]]
- [[12-directives/gzip-http-version|gzip_http_version]]
- [[12-directives/gzip-min-length|gzip_min_length]]
- [[12-directives/gzip-proxied|gzip_proxied]]
- [[12-directives/gzip-types|gzip_types]]
- [[12-directives/gzip-vary|gzip_vary]]

## Variables intégrées

- [[13-variables/gzip-ratio|$gzip_ratio]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

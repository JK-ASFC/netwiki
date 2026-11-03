---
title: "ngx_http_slice_module"
description: "Module nginx ngx_http_slice_module — The ngx_http_slice_module module (1.9.8) is a filter that splits a request into subrequests, each returning a certain range of response. The filter provides more effective caching of big responses."
tags: [nginx, module, ngx_http_slice_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_slice_module` module (1.9.8) is a filter that splits a request into subrequests, each returning a certain range of response. The filter provides more effective caching of big responses.

This module is not built by default, it should be enabled with the `--with-http_slice_module` configuration parameter.

## Known Issues

Currently, the module does not work as expected in subrequests such as [[12-directives/proxy-cache-background-update|background cache update]]. In this case, a request is constructed without byte-range support.

## Example Configuration

```nginx
location / {
    slice             1m;
    proxy_cache       cache;
    proxy_cache_key   $uri$is_args$args$slice_range;
    proxy_set_header  Range $slice_range;
    proxy_cache_valid 200 206 1h;
    proxy_pass        http://localhost:8000;
}
```

In this example, the response is split into 1-megabyte cacheable slices.

## Directives

- [[12-directives/slice|slice]]

## Variables intégrées

- [[13-variables/slice-range|$slice_range]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

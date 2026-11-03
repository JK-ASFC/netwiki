---
title: "ngx_http_headers_module"
description: "Module nginx ngx_http_headers_module — The ngx_http_headers_module module allows adding the Expires and Cache-Control header fields, and arbitrary fields, to a response header."
tags: [nginx, module, ngx_http_headers_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_headers_module` module allows adding the `Expires` and `Cache-Control` header fields, and arbitrary fields, to a response header.

## Example Configuration

```nginx
expires    24h;
expires    modified +24h;
expires    @24h;
expires    0;
expires    -1;
expires    epoch;
expires    $expires;
add_header Cache-Control private;
```

## Directives

- [[12-directives/add-header|add_header]]
- [[12-directives/add-header-inherit|add_header_inherit]]
- [[12-directives/add-trailer|add_trailer]]
- [[12-directives/add-trailer-inherit|add_trailer_inherit]]
- [[12-directives/expires|expires]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

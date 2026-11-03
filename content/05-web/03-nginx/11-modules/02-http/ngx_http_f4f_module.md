---
title: "ngx_http_f4f_module"
description: "Module nginx ngx_http_f4f_module — The ngx_http_f4f_module module provides server-side support for Adobe HTTP Dynamic Streaming (HDS)."
tags: [nginx, module, ngx_http_f4f_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_f4f_module` module provides server-side support for Adobe HTTP Dynamic Streaming (HDS).

This module implements handling of HTTP Dynamic Streaming requests in the “`/videoSeg1-Frag1`” form — extracting the needed fragment from the `videoSeg1.f4f` file using the `videoSeg1.f4x` index file. This module is an alternative to the Adobe’s f4f module (HTTP Origin Module) for Apache.

Usual pre-processing with Adobe’s f4fpackager is required, see relevant documentation for details.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Example Configuration

```nginx
location /video/ {
    f4f;
    ...
}
```

## Directives

- [[12-directives/f4f|f4f]]
- [[12-directives/f4f-buffer-size|f4f_buffer_size]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

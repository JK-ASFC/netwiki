---
title: "ngx_http_empty_gif_module"
description: "Module nginx ngx_http_empty_gif_module — The ngx_http_empty_gif_module module emits single-pixel transparent GIF."
tags: [nginx, module, ngx_http_empty_gif_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_empty_gif_module` module emits single-pixel transparent GIF.

## Example Configuration

```nginx
location = /_.gif {
    empty_gif;
}
```

## Directives

- [[12-directives/empty-gif|empty_gif]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

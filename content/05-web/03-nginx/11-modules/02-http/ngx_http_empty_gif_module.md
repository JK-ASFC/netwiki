---
title: "ngx_http_empty_gif_module"
description: "Module nginx ngx_http_empty_gif_module — Le module ngx_http_empty_gif_module renvoie un GIF transparent d'un pixel."
tags: [nginx, module, ngx_http_empty_gif_module]
icon: puzzle
---

Le module `ngx_http_empty_gif_module` renvoie un GIF transparent d'un pixel.

## Exemple de configuration

```nginx
location = /_.gif {
    empty_gif;
}
```

## Directives

- [[12-directives/empty-gif|empty_gif]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_http_image_filter_module"
description: "Module nginx ngx_http_image_filter_module — Le module ngx_http_image_filter_module (0.7.54+) est un filtre qui transforme les images aux formats JPEG, GIF, PNG et WebP."
tags: [nginx, module, ngx_http_image_filter_module]
icon: puzzle
---

Le module `ngx_http_image_filter_module` (0.7.54+) est un filtre qui transforme les images aux formats JPEG, GIF, PNG et WebP.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_image_filter_module`.

> [!NOTE]
> Ce module utilise la bibliothèque [libgd](http://libgd.org). Il est recommandé d'utiliser la version la plus récente de la bibliothèque.

> [!NOTE]
> La prise en charge du format WebP est apparue en version 1.11.6. Pour transformer des images dans ce format, la bibliothèque `libgd` doit être compilée avec la prise en charge de WebP.

## Exemple de configuration

```nginx
location /img/ {
    proxy_pass   http://backend;
    image_filter resize 150 100;
    image_filter rotate 90;
    error_page   415 = /empty;
}

location = /empty {
    empty_gif;
}
```

## Directives

- [[12-directives/image-filter|image_filter]]
- [[12-directives/image-filter-buffer|image_filter_buffer]]
- [[12-directives/image-filter-interlace|image_filter_interlace]]
- [[12-directives/image-filter-jpeg-quality|image_filter_jpeg_quality]]
- [[12-directives/image-filter-sharpen|image_filter_sharpen]]
- [[12-directives/image-filter-transparency|image_filter_transparency]]
- [[12-directives/image-filter-webp-quality|image_filter_webp_quality]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

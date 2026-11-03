---
title: "ngx_http_image_filter_module"
description: "Module nginx ngx_http_image_filter_module — The ngx_http_image_filter_module module (0.7.54+) is a filter that transforms images in JPEG, GIF, PNG, and WebP formats."
tags: [nginx, module, ngx_http_image_filter_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_image_filter_module` module (0.7.54+) is a filter that transforms images in JPEG, GIF, PNG, and WebP formats.

This module is not built by default, it should be enabled with the `--with-http_image_filter_module` configuration parameter.

> [!NOTE]
> This module utilizes the [libgd](http://libgd.org) library. It is recommended to use the latest available version of the library.

> [!NOTE]
> The WebP format support appeared in version 1.11.6. To transform images in this format, the `libgd` library must be compiled with the WebP support.

## Example Configuration

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

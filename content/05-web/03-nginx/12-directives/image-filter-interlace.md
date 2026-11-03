---
title: "image_filter_interlace"
description: "Directive nginx image_filter_interlace (ngx_http_image_filter_module) — Si cette option est activée, les images finales sont entrelacées. Pour le JPEG, elles sont au format « JPEG progressif »."
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_interlace on \| off;` |
| **Valeur par défaut** | `image_filter_interlace off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.3.15 |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Si cette option est activée, les images finales sont entrelacées. Pour le JPEG, elles sont au format « JPEG progressif ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

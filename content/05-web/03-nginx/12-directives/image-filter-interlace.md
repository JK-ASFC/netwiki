---
title: "image_filter_interlace"
description: "Directive nginx image_filter_interlace (ngx_http_image_filter_module) — If enabled, final images will be interlaced. For JPEG, final images will be in “progressive JPEG” format."
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_interlace on \| off;` |
| **Valeur par défaut** | `image_filter_interlace off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.3.15 |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

If enabled, final images will be interlaced. For JPEG, final images will be in “progressive JPEG” format.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

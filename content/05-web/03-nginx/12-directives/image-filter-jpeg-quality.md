---
title: "image_filter_jpeg_quality"
description: "Directive nginx image_filter_jpeg_quality (ngx_http_image_filter_module) — Sets the desired quality of the transformed JPEG images. Acceptable values are in the range from 1 to 100. Lesser values usually imply both lower image quality and less data to transfer. The maximum…"
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_jpeg_quality quality;` |
| **Valeur par défaut** | `image_filter_jpeg_quality 75;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Sets the desired *quality* of the transformed JPEG images. Acceptable values are in the range from 1 to 100. Lesser values usually imply both lower image quality and less data to transfer. The maximum recommended value is 95. Parameter value can contain variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

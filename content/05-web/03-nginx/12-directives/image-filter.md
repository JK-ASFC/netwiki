---
title: "image_filter"
description: "Directive nginx image_filter (ngx_http_image_filter_module) — Sets the type of transformation to perform on images: - off turns off module processing in a surrounding location. - test ensures that responses are images in either JPEG, GIF, PNG, or WebP format.…"
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter off;` ou `image_filter test;` ou `image_filter size;` ou `image_filter rotate 90 \| 180 \| 270;` ou `image_filter resize width height;` ou `image_filter crop width height;` |
| **Valeur par défaut** | `image_filter off;` |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Sets the type of transformation to perform on images:

- **`off`**

  turns off module processing in a surrounding location.

- **`test`**

  ensures that responses are images in either JPEG, GIF, PNG, or WebP format. Otherwise, the `415 Unsupported Media Type` error is returned.

- **`size`**

  outputs information about images in a JSON format, e.g.:

  ```nginx
  { "img" : { "width": 100, "height": 100, "type": "gif" } }
  ```

  In case of an error, the output is as follows:

  ```nginx
  {}
  ```

- **`rotate` `90`|`180`|`270`**

  rotates images counter-clockwise by the specified number of degrees. Parameter value can contain variables. This mode can be used either alone or along with the `resize` and `crop` transformations.

- **`resize` *width* *height***

  proportionally reduces an image to the specified sizes. To reduce by only one dimension, another dimension can be specified as “`-`”. In case of an error, the server will return code `415 Unsupported Media Type`. Parameter values can contain variables. When used along with the `rotate` parameter, the rotation happens *after* reduction.

- **`crop` *width* *height***

  proportionally reduces an image to the larger side size and crops extraneous edges by another side. To reduce by only one dimension, another dimension can be specified as “`-`”. In case of an error, the server will return code `415 Unsupported Media Type`. Parameter values can contain variables. When used along with the `rotate` parameter, the rotation happens *before* reduction.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "image_filter_buffer"
description: "Directive nginx image_filter_buffer (ngx_http_image_filter_module) — Sets the maximum size of the buffer used for reading images. When the size is exceeded the server returns error 415 Unsupported Media Type."
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_buffer size;` |
| **Valeur par défaut** | `image_filter_buffer 1M;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Sets the maximum size of the buffer used for reading images. When the size is exceeded the server returns error `415 Unsupported Media Type`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "mp4_max_buffer_size"
description: "Directive nginx mp4_max_buffer_size (ngx_http_mp4_module) — During metadata processing, a larger buffer may become necessary. Its size cannot exceed the specified size, or else nginx will return the 500 Internal Server Error server error, and log the…"
tags: [nginx, directive, ngx_http_mp4_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mp4_max_buffer_size size;` |
| **Valeur par défaut** | `mp4_max_buffer_size 10M;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mp4_module\|ngx_http_mp4_module]] |

## Utilisation

During metadata processing, a larger buffer may become necessary. Its size cannot exceed the specified *size*, or else nginx will return the `500 Internal Server Error` server error, and log the following message:

```nginx
"/some/movie/file.mp4" mp4 moov atom is too large:
12583268, you may want to increase mp4_max_buffer_size
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

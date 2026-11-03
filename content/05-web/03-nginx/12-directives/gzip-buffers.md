---
title: "gzip_buffers"
description: "Directive nginx gzip_buffers (ngx_http_gzip_module) — Sets the number and size of buffers used to compress a response. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform. NOTE Until version 0.7.28,…"
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_buffers number size;` |
| **Valeur par défaut** | `gzip_buffers 32 4k\|16 8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Sets the *number* and *size* of buffers used to compress a response. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform.

> [!NOTE]
> Until version 0.7.28, four 4K or 8K buffers were used by default.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

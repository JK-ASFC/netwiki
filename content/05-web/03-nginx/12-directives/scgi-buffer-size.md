---
title: "scgi_buffer_size"
description: "Directive nginx scgi_buffer_size (ngx_http_scgi_module) — Sets the size of the buffer used for reading the first part of the response received from the SCGI server. This part usually contains a small response header; if it exceeds the buffer size, the…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_buffer_size size;` |
| **Valeur par défaut** | `scgi_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Sets the *size* of the buffer used for reading the first part of the response received from the SCGI server. This part usually contains a small response header; if it exceeds the buffer size, the response is considered invalid. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform. It can be made smaller, however.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

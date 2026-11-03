---
title: "gunzip_buffers"
description: "Directive nginx gunzip_buffers (ngx_http_gunzip_module) — Sets the number and size of buffers used to decompress a response. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform."
tags: [nginx, directive, ngx_http_gunzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gunzip_buffers number size;` |
| **Valeur par défaut** | `gunzip_buffers 32 4k\|16 8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gunzip_module\|ngx_http_gunzip_module]] |

## Utilisation

Sets the *number* and *size* of buffers used to decompress a response. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

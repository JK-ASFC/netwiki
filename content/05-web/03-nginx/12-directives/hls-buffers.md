---
title: "hls_buffers"
description: "Directive nginx hls_buffers (ngx_http_hls_module) — Sets the maximum number and size of buffers that are used for reading and writing data frames."
tags: [nginx, directive, ngx_http_hls_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hls_buffers number size;` |
| **Valeur par défaut** | `hls_buffers 8 2m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_hls_module\|ngx_http_hls_module]] |

## Utilisation

Sets the maximum *number* and *size* of buffers that are used for reading and writing data frames.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

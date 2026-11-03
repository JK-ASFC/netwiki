---
title: "hls_mp4_buffer_size"
description: "Directive nginx hls_mp4_buffer_size (ngx_http_hls_module) — Sets the initial size of the buffer used for processing MP4 and MOV files."
tags: [nginx, directive, ngx_http_hls_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hls_mp4_buffer_size size;` |
| **Valeur par défaut** | `hls_mp4_buffer_size 512k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_hls_module\|ngx_http_hls_module]] |

## Utilisation

Sets the initial *size* of the buffer used for processing MP4 and MOV files.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

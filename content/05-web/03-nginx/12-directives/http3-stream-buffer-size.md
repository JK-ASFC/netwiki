---
title: "http3_stream_buffer_size"
description: "Directive nginx http3_stream_buffer_size (ngx_http_v3_module) — Sets the size of the buffer used for reading and writing of the QUIC streams."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http3_stream_buffer_size size;` |
| **Valeur par défaut** | `http3_stream_buffer_size 64k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Sets the size of the buffer used for reading and writing of the QUIC streams.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

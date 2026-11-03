---
title: "http3_stream_buffer_size"
description: "Directive nginx http3_stream_buffer_size (ngx_http_v3_module) — Définit la taille du tampon de lecture et d'écriture des flux QUIC."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http3_stream_buffer_size size;` |
| **Valeur par défaut** | `http3_stream_buffer_size 64k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Définit la taille du tampon de lecture et d'écriture des flux QUIC.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

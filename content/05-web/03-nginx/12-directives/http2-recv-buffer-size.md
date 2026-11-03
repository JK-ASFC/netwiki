---
title: "http2_recv_buffer_size"
description: "Directive nginx http2_recv_buffer_size (ngx_http_v2_module) — Sets the size of the per worker input buffer."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_recv_buffer_size size;` |
| **Valeur par défaut** | `http2_recv_buffer_size 256k;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

Sets the size of the per [[12-directives/worker-processes|worker]] input buffer.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

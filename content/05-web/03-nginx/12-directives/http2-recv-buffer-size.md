---
title: "http2_recv_buffer_size"
description: "Directive nginx http2_recv_buffer_size (ngx_http_v2_module) — Définit la taille du tampon d'entrée par processus de travail."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_recv_buffer_size size;` |
| **Valeur par défaut** | `http2_recv_buffer_size 256k;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

Définit la taille du tampon d'entrée par [[12-directives/worker-processes|processus de travail]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

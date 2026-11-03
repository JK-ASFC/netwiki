---
title: "preread_buffer_size"
description: "Directive nginx preread_buffer_size (ngx_stream_core_module) — Définit la taille du tampon de prélecture."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `preread_buffer_size size;` |
| **Valeur par défaut** | `preread_buffer_size 16k;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Définit la *taille* du tampon de [[10-guides/03-stream/stream-processing|prélecture]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

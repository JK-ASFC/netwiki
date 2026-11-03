---
title: "preread_timeout"
description: "Directive nginx preread_timeout (ngx_stream_core_module) — Définit le délai de la phase de prélecture."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `preread_timeout timeout;` |
| **Valeur par défaut** | `preread_timeout 30s;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Définit le *délai* de la phase de [[10-guides/03-stream/stream-processing|prélecture]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "preread_timeout"
description: "Directive nginx preread_timeout (ngx_stream_core_module) — Specifies a timeout of the preread phase."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `preread_timeout timeout;` |
| **Valeur par défaut** | `preread_timeout 30s;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Specifies a *timeout* of the [[10-guides/03-stream/stream-processing|preread]] phase.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

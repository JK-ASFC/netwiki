---
title: "ssl_preread"
description: "Directive nginx ssl_preread (ngx_stream_ssl_preread_module) — Enables extracting information from the ClientHello message at the preread phase."
tags: [nginx, directive, ngx_stream_ssl_preread_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_preread on \| off;` |
| **Valeur par défaut** | `ssl_preread off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_preread_module\|ngx_stream_ssl_preread_module]] |

## Utilisation

Enables extracting information from the ClientHello message at the [[10-guides/03-stream/stream-processing|preread]] phase.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

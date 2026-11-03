---
title: "ssl_preread"
description: "Directive nginx ssl_preread (ngx_stream_ssl_preread_module) — Active l'extraction d'informations du message ClientHello à la phase de prélecture."
tags: [nginx, directive, ngx_stream_ssl_preread_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_preread on \| off;` |
| **Valeur par défaut** | `ssl_preread off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_preread_module\|ngx_stream_ssl_preread_module]] |

## Utilisation

Active l'extraction d'informations du message ClientHello à la phase de [[10-guides/03-stream/stream-processing|prélecture]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

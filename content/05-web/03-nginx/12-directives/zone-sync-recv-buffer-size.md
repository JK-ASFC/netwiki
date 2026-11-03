---
title: "zone_sync_recv_buffer_size"
description: "Directive nginx zone_sync_recv_buffer_size (ngx_stream_zone_sync_module) — Définit la taille du tampon de réception, par connexion, utilisé pour analyser le flux entrant de messages de synchronisation. Elle doit être supérieure ou égale à celle d'un des tampons…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_recv_buffer_size size;` |
| **Valeur par défaut** | `zone_sync_recv_buffer_size 4k\|8k;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Définit la *taille* du tampon de réception, par connexion, utilisé pour analyser le flux entrant de messages de synchronisation. Elle doit être supérieure ou égale à celle d'un des tampons [[12-directives/zone-sync-buffers|zone_sync_buffers]]. Par défaut, elle vaut la *taille* de [[12-directives/zone-sync-buffers|zone_sync_buffers]] multipliée par leur *nombre*.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

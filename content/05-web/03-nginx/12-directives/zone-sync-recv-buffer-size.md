---
title: "zone_sync_recv_buffer_size"
description: "Directive nginx zone_sync_recv_buffer_size (ngx_stream_zone_sync_module) — Sets size of a per-connection receive buffer used to parse incoming stream of synchronization messages. The buffer size must be equal or greater than one of the zone_sync_buffers. By default, the…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_recv_buffer_size size;` |
| **Valeur par défaut** | `zone_sync_recv_buffer_size 4k\|8k;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Sets *size* of a per-connection receive buffer used to parse incoming stream of synchronization messages. The buffer size must be equal or greater than one of the [[12-directives/zone-sync-buffers|zone_sync_buffers]]. By default, the buffer size is equal to [[12-directives/zone-sync-buffers|zone_sync_buffers]] *size* multiplied by *number*.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

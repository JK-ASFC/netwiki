---
title: "zone_sync"
description: "Directive nginx zone_sync (ngx_stream_zone_sync_module) — Enables the synchronization of shared memory zones between cluster nodes. Cluster nodes are defined using zone_sync_server directives."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Enables the synchronization of shared memory zones between cluster nodes. Cluster nodes are defined using [[12-directives/zone-sync-server|zone_sync_server]] directives.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

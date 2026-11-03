---
title: "zone_sync"
description: "Directive nginx zone_sync (ngx_stream_zone_sync_module) — Active la synchronisation des zones de mémoire partagée entre les nœuds du cluster. Les nœuds sont définis avec les directives zone_sync_server."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Active la synchronisation des zones de mémoire partagée entre les nœuds du cluster. Les nœuds sont définis avec les directives [[12-directives/zone-sync-server|zone_sync_server]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

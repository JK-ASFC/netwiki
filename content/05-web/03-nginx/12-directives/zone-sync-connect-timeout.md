---
title: "zone_sync_connect_timeout"
description: "Directive nginx zone_sync_connect_timeout (ngx_stream_zone_sync_module) — Defines a timeout for establishing a connection with another cluster node."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_connect_timeout time;` |
| **Valeur par défaut** | `zone_sync_connect_timeout 5s;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Defines a timeout for establishing a connection with another cluster node.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

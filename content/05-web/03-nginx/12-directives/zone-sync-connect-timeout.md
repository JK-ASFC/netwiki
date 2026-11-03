---
title: "zone_sync_connect_timeout"
description: "Directive nginx zone_sync_connect_timeout (ngx_stream_zone_sync_module) — Définit le délai d'établissement d'une connexion avec un autre nœud du cluster."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_connect_timeout time;` |
| **Valeur par défaut** | `zone_sync_connect_timeout 5s;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Définit le délai d'établissement d'une connexion avec un autre nœud du cluster.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "zone_sync_timeout"
description: "Directive nginx zone_sync_timeout (ngx_stream_zone_sync_module) — Définit le délai entre deux opérations successives de lecture ou d'écriture sur la connexion vers un autre nœud du cluster. Si aucune donnée n'est transmise dans ce délai, la connexion est fermée."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_timeout timeout;` |
| **Valeur par défaut** | `zone_sync_timeout 5s;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Définit le *délai* entre deux opérations successives de lecture ou d'écriture sur la connexion vers un autre nœud du cluster. Si aucune donnée n'est transmise dans ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

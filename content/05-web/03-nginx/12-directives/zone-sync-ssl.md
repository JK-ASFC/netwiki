---
title: "zone_sync_ssl"
description: "Directive nginx zone_sync_ssl (ngx_stream_zone_sync_module) — Active le protocole SSL/TLS pour les connexions vers un autre serveur du cluster."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl on \| off;` |
| **Valeur par défaut** | `zone_sync_ssl off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Active le protocole SSL/TLS pour les connexions vers un autre serveur du cluster.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

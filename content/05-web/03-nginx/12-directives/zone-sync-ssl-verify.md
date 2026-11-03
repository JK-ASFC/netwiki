---
title: "zone_sync_ssl_verify"
description: "Directive nginx zone_sync_ssl_verify (ngx_stream_zone_sync_module) — Active ou désactive la vérification du certificat d'un autre serveur du cluster."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_verify on \| off;` |
| **Valeur par défaut** | `zone_sync_ssl_verify off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Active ou désactive la vérification du certificat d'un autre serveur du cluster.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

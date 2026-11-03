---
title: "zone_sync_ssl_verify_depth"
description: "Directive nginx zone_sync_ssl_verify_depth (ngx_stream_zone_sync_module) — Définit la profondeur de vérification dans la chaîne de certificats d'un autre serveur du cluster."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_verify_depth number;` |
| **Valeur par défaut** | `zone_sync_ssl_verify_depth 1;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Définit la profondeur de vérification dans la chaîne de certificats d'un autre serveur du cluster.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

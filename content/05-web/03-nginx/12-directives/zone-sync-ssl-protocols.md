---
title: "zone_sync_ssl_protocols"
description: "Directive nginx zone_sync_ssl_protocols (ngx_stream_zone_sync_module) — Enables the specified protocols for connections to another cluster server."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_protocols [SSLv2] [SSLv3] [TLSv1] [TLSv1.1] [TLSv1.2] [TLSv1.3];` |
| **Valeur par défaut** | `zone_sync_ssl_protocols TLSv1.2 TLSv1.3;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Enables the specified protocols for connections to another cluster server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "zone_sync_ssl_server_name"
description: "Directive nginx zone_sync_ssl_server_name (ngx_stream_zone_sync_module) — Active ou désactive la transmission du nom de serveur via l'extension TLS Server Name Indication (SNI, RFC 6066) lors de l'établissement d'une connexion avec un autre serveur du cluster."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_server_name on \| off;` |
| **Valeur par défaut** | `zone_sync_ssl_server_name off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.7 |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Active ou désactive la transmission du nom de serveur via l'[extension TLS Server Name Indication](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066) lors de l'établissement d'une connexion avec un autre serveur du cluster.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

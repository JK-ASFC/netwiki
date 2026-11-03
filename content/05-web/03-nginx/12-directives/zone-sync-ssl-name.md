---
title: "zone_sync_ssl_name"
description: "Directive nginx zone_sync_ssl_name (ngx_stream_zone_sync_module) — Allows overriding the server name used to verify the certificate of a cluster server and to be passed through SNI when establishing a connection with the cluster server. By default, the host part of…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_name name;` |
| **Valeur par défaut** | `zone_sync_ssl_name host from zone_sync_server;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.7 |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Allows overriding the server name used to [[12-directives/zone-sync-ssl-verify|verify]] the certificate of a cluster server and to be [[12-directives/zone-sync-ssl-server-name|passed through SNI]] when establishing a connection with the cluster server.

By default, the host part of the [[12-directives/zone-sync-server|zone_sync_server]] address is used, or resolved IP address if the `resolve` parameter is specified.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

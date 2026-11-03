---
title: "zone_sync_ssl_server_name"
description: "Directive nginx zone_sync_ssl_server_name (ngx_stream_zone_sync_module) — Enables or disables passing of the server name through TLS Server Name Indication extension (SNI, RFC 6066) when establishing a connection with another cluster server."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_server_name on \| off;` |
| **Valeur par défaut** | `zone_sync_ssl_server_name off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.7 |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Enables or disables passing of the server name through [TLS Server Name Indication extension](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066) when establishing a connection with another cluster server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "zone_sync_ssl_conf_command"
description: "Directive nginx zone_sync_ssl_conf_command (ngx_stream_zone_sync_module) — Sets arbitrary OpenSSL configuration commands when establishing a connection with another cluster server. NOTE The directive is supported when using OpenSSL 1.0.2 or higher. Several…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_conf_command name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Sets arbitrary OpenSSL configuration [commands](https://www.openssl.org/docs/man1.1.1/man3/SSL_CONF_cmd.html) when establishing a connection with another cluster server.

> [!NOTE]
> The directive is supported when using OpenSSL 1.0.2 or higher.

Several `zone_sync_ssl_conf_command` directives can be specified on the same level. These directives are inherited from the previous configuration level if and only if there are no `zone_sync_ssl_conf_command` directives defined on the current level.

> [!NOTE]
> Note that configuring OpenSSL directly might result in unexpected behavior.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

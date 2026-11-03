---
title: "zone_sync_ssl_ciphers"
description: "Directive nginx zone_sync_ssl_ciphers (ngx_stream_zone_sync_module) — Specifies the enabled ciphers for connections to another cluster server. The ciphers are specified in the format understood by the OpenSSL library. The full list can be viewed using the “openssl…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `zone_sync_ssl_ciphers DEFAULT;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Specifies the enabled ciphers for connections to another cluster server. The ciphers are specified in the format understood by the OpenSSL library.

The full list can be viewed using the “`openssl ciphers`” command.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

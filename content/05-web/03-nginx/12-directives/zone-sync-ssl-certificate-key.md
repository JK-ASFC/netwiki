---
title: "zone_sync_ssl_certificate_key"
description: "Directive nginx zone_sync_ssl_certificate_key (ngx_stream_zone_sync_module) — Specifies a file with the secret key in the PEM format used for authentication to another cluster server."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Specifies a *file* with the secret key in the PEM format used for authentication to another cluster server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

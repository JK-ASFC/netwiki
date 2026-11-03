---
title: "zone_sync_ssl_crl"
description: "Directive nginx zone_sync_ssl_crl (ngx_stream_zone_sync_module) — Specifies a file with revoked certificates (CRL) in the PEM format used to verify the certificate of another cluster server. When using intermediate certificates, their CRLs should be specified in…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Specifies a *file* with revoked certificates (CRL) in the PEM format used to [[12-directives/zone-sync-ssl-verify|verify]] the certificate of another cluster server. When using intermediate certificates, their CRLs should be specified in the same file.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

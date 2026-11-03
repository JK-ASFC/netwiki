---
title: "ssl_crl (ngx_stream_ssl_module)"
description: "Directive nginx ssl_crl (ngx_stream_ssl_module) — Specifies a file with revoked certificates (CRL) in the PEM format used to verify client certificates. When using intermediate certificates, their CRLs should be specified in the same file."
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.8 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Specifies a *file* with revoked certificates (CRL) in the PEM format used to [[12-directives/ssl-verify-client-stream-ssl|verify]] client certificates. When using intermediate certificates, their CRLs should be specified in the same file.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

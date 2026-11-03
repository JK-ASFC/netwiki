---
title: "ssl_ocsp (ngx_stream_ssl_module)"
description: "Directive nginx ssl_ocsp (ngx_stream_ssl_module) — Enables OCSP validation of the client certificate chain. The leaf parameter enables validation of the client certificate only. For the OCSP validation to work, the ssl_verify_client directive should…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ocsp on \| off \| leaf;` |
| **Valeur par défaut** | `ssl_ocsp off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Enables OCSP validation of the client certificate chain. The `leaf` parameter enables validation of the client certificate only.

For the OCSP validation to work, the [[12-directives/ssl-verify-client-stream-ssl|ssl_verify_client]] directive should be set to `on` or `optional`.

To resolve the OCSP responder hostname, the [[12-directives/resolver-stream-core|resolver]] directive should also be specified.

Example:

```nginx
ssl_verify_client on;
ssl_ocsp          on;
resolver          192.0.2.1;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

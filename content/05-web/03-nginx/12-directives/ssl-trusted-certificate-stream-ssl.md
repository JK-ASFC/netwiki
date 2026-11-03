---
title: "ssl_trusted_certificate (ngx_stream_ssl_module)"
description: "Directive nginx ssl_trusted_certificate (ngx_stream_ssl_module) — Specifies a file with trusted CA certificates in the PEM format used to verify client certificates and OCSP responses if ssl_stapling is enabled. In contrast to the certificate set by…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.8 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Specifies a *file* with trusted CA certificates in the PEM format used to [[12-directives/ssl-verify-client-stream-ssl|verify]] client certificates and OCSP responses if [[12-directives/ssl-stapling-stream-ssl|ssl_stapling]] is enabled.

In contrast to the certificate set by [[12-directives/ssl-client-certificate-stream-ssl|ssl_client_certificate]], the list of these certificates will not be sent to clients.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

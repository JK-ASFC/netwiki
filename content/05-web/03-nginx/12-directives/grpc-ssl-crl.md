---
title: "grpc_ssl_crl"
description: "Directive nginx grpc_ssl_crl (ngx_http_grpc_module) — Specifies a file with revoked certificates (CRL) in the PEM format used to verify the certificate of the gRPC SSL server. When using intermediate certificates, their CRLs should be specified in the…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Specifies a *file* with revoked certificates (CRL) in the PEM format used to [[12-directives/grpc-ssl-verify|verify]] the certificate of the gRPC SSL server. When using intermediate certificates, their CRLs should be specified in the same file.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

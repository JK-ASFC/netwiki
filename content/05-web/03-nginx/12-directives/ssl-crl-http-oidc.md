---
title: "ssl_crl (ngx_http_oidc_module)"
description: "Directive nginx ssl_crl (ngx_http_oidc_module) — Specifies a file with revoked certificates (CRL) in the PEM format used to verify the certificates of the OpenID Provider endpoints. When using intermediate certificates, their CRLs should be…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Specifies a *file* with revoked certificates (CRL) in the PEM format used to verify the certificates of the OpenID Provider endpoints. When using intermediate certificates, their CRLs should be specified in the same file.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

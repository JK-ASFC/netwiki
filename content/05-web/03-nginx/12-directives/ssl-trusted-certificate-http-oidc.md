---
title: "ssl_trusted_certificate (ngx_http_oidc_module)"
description: "Directive nginx ssl_trusted_certificate (ngx_http_oidc_module) — Specifies a file with trusted CA certificates in the PEM format used to verify the certificates of the OpenID Provider endpoints."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_trusted_certificate file;` |
| **Valeur par défaut** | `ssl_trusted_certificate system CA bundle;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Specifies a *file* with trusted CA certificates in the PEM format used to verify the certificates of the OpenID Provider endpoints.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

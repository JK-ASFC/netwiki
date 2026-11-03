---
title: "ssl_client_certificate (ngx_http_ssl_module)"
description: "Directive nginx ssl_client_certificate (ngx_http_ssl_module) — Specifies a file with trusted CA certificates in the PEM format used to verify client certificates and OCSP responses if ssl_stapling is enabled. The list of certificates will be sent to clients. If…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_client_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Specifies a *file* with trusted CA certificates in the PEM format used to [[12-directives/ssl-verify-client-http-ssl|verify]] client certificates and OCSP responses if [[12-directives/ssl-stapling-http-ssl|ssl_stapling]] is enabled.

The list of certificates will be sent to clients. If this is not desired, the [[12-directives/ssl-trusted-certificate-http-ssl|ssl_trusted_certificate]] directive can be used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

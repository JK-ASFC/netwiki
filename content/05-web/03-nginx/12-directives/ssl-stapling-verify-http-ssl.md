---
title: "ssl_stapling_verify (ngx_http_ssl_module)"
description: "Directive nginx ssl_stapling_verify (ngx_http_ssl_module) — Enables or disables verification of OCSP responses by the server. For verification to work, the certificate of the server certificate issuer, the root certificate, and all intermediate certificates…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_stapling_verify on \| off;` |
| **Valeur par défaut** | `ssl_stapling_verify off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.3.7 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Enables or disables verification of OCSP responses by the server.

For verification to work, the certificate of the server certificate issuer, the root certificate, and all intermediate certificates should be configured as trusted using the [[12-directives/ssl-trusted-certificate-http-ssl|ssl_trusted_certificate]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

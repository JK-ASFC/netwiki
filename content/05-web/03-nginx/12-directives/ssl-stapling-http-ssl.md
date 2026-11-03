---
title: "ssl_stapling (ngx_http_ssl_module)"
description: "Directive nginx ssl_stapling (ngx_http_ssl_module) — Enables or disables stapling of OCSP responses by the server. Example: nginx ssl_stapling on; resolver 192.0.2.1; For the OCSP stapling to work, the certificate of the server certificate issuer…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_stapling on \| off;` |
| **Valeur par défaut** | `ssl_stapling off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.3.7 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Enables or disables [stapling of OCSP responses](https://datatracker.ietf.org/doc/html/rfc6066#section-8) by the server. Example:

```nginx
ssl_stapling on;
resolver 192.0.2.1;
```

For the OCSP stapling to work, the certificate of the server certificate issuer should be known. If the [[12-directives/ssl-certificate-http-ssl|ssl_certificate]] file does not contain intermediate certificates, the certificate of the server certificate issuer should be present in the [[12-directives/ssl-trusted-certificate-http-ssl|ssl_trusted_certificate]] file.

For a resolution of the OCSP responder hostname, the [[12-directives/resolver-http-core|resolver]] directive should also be specified.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

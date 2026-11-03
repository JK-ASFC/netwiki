---
title: "proxy_ssl_crl (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_crl (ngx_http_proxy_module) — Specifies a file with revoked certificates (CRL) in the PEM format used to verify the certificate of the proxied HTTPS server. When using intermediate certificates, their CRLs should be specified in…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Specifies a *file* with revoked certificates (CRL) in the PEM format used to [[12-directives/proxy-ssl-verify-http-proxy|verify]] the certificate of the proxied HTTPS server. When using intermediate certificates, their CRLs should be specified in the same file.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

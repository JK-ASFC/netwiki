---
title: "ssl_verify_client (ngx_http_ssl_module)"
description: "Directive nginx ssl_verify_client (ngx_http_ssl_module) — Enables verification of client certificates. The verification result is stored in the $ssl_client_verify variable. The optional parameter (0.8.7+) requests the client certificate and verifies it if…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_verify_client on \| off \| optional \| optional_no_ca;` |
| **Valeur par défaut** | `ssl_verify_client off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Enables verification of client certificates. The verification result is stored in the [[13-variables/ssl-client-verify-http-ssl|$ssl_client_verify]] variable.

The `optional` parameter (0.8.7+) requests the client certificate and verifies it if the certificate is present.

The `optional_no_ca` parameter (1.3.8, 1.2.5) requests the client certificate but does not require it to be signed by a trusted CA certificate. This is intended for the use in cases when a service that is external to nginx performs the actual certificate verification. The contents of the certificate is accessible through the [[13-variables/ssl-client-cert-http-ssl|$ssl_client_cert]] variable.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

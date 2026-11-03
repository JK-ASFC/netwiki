---
title: "proxy_ssl_trusted_certificate (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_trusted_certificate (ngx_stream_proxy_module) — Specifies a file with trusted CA certificates in the PEM format used to verify the certificate of the proxied server."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Specifies a *file* with trusted CA certificates in the PEM format used to [[12-directives/proxy-ssl-verify-stream-proxy|verify]] the certificate of the proxied server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

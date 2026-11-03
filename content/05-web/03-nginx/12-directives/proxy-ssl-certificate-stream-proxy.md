---
title: "proxy_ssl_certificate (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_certificate (ngx_stream_proxy_module) — Specifies a file with the certificate in the PEM format used for authentication to a proxied server. Since version 1.21.0, variables can be used in the file name."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Specifies a *file* with the certificate in the PEM format used for authentication to a proxied server.

Since version 1.21.0, variables can be used in the *file* name.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

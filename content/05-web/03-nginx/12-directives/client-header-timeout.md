---
title: "client_header_timeout"
description: "Directive nginx client_header_timeout (ngx_http_core_module) — Defines a timeout for reading client request header. If a client does not transmit the entire header within this time, the request is terminated with the 408 Request Time-out error."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_header_timeout time;` |
| **Valeur par défaut** | `client_header_timeout 60s;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Defines a timeout for reading client request header. If a client does not transmit the entire header within this time, the request is terminated with the `408 Request Time-out` error.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

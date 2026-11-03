---
title: "client_max_body_size"
description: "Directive nginx client_max_body_size (ngx_http_core_module) — Sets the maximum allowed size of the client request body. If the size in a request exceeds the configured value, the 413 Request Entity Too Large error is returned to the client. Please be aware that…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_max_body_size size;` |
| **Valeur par défaut** | `client_max_body_size 1m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the maximum allowed size of the client request body. If the size in a request exceeds the configured value, the `413 Request Entity Too Large` error is returned to the client. Please be aware that browsers cannot correctly display this error. Setting *size* to 0 disables checking of client request body size.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

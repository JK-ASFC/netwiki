---
title: "max_headers"
description: "Directive nginx max_headers (ngx_http_core_module) — Sets the maximum allowed number of header lines in requests. If this limit is reached, the error 400 Bad Request is returned."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `max_headers number;` |
| **Valeur par défaut** | `max_headers 1000;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.29.8 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the maximum allowed number of header lines in requests. If this limit is reached, the error `400 Bad Request` is returned.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

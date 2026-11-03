---
title: "http2_body_preread_size"
description: "Directive nginx http2_body_preread_size (ngx_http_v2_module) — Sets the size of the buffer per each request in which the request body may be saved before it is started to be processed."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_body_preread_size size;` |
| **Valeur par défaut** | `http2_body_preread_size 64k;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.11.0 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

Sets the *size* of the buffer per each request in which the request body may be saved before it is started to be processed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

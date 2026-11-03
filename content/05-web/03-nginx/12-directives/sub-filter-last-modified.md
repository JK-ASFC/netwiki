---
title: "sub_filter_last_modified"
description: "Directive nginx sub_filter_last_modified (ngx_http_sub_module) — Allows preserving the Last-Modified header field from the original response during replacement to facilitate response caching. By default, the header field is removed as contents of the response are…"
tags: [nginx, directive, ngx_http_sub_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sub_filter_last_modified on \| off;` |
| **Valeur par défaut** | `sub_filter_last_modified off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.1 |
| **Module** | [[11-modules/02-http/ngx_http_sub_module\|ngx_http_sub_module]] |

## Utilisation

Allows preserving the `Last-Modified` header field from the original response during replacement to facilitate response caching.

By default, the header field is removed as contents of the response are modified during processing.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

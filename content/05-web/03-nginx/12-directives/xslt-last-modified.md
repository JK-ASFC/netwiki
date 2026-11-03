---
title: "xslt_last_modified"
description: "Directive nginx xslt_last_modified (ngx_http_xslt_module) — Allows preserving the Last-Modified header field from the original response during XSLT transformations to facilitate response caching. By default, the header field is removed as contents of the…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xslt_last_modified on \| off;` |
| **Valeur par défaut** | `xslt_last_modified off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.1 |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Allows preserving the `Last-Modified` header field from the original response during XSLT transformations to facilitate response caching.

By default, the header field is removed as contents of the response are modified during transformations and may contain dynamically generated elements or parts that are changed independently of the original response.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

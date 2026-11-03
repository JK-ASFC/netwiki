---
title: "xslt_types"
description: "Directive nginx xslt_types (ngx_http_xslt_module) — Enables transformations in responses with the specified MIME types in addition to “text/xml”. The special value “” matches any MIME type (0.8.29). If the transformation result is an HTML response,…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xslt_types mime-type ...;` |
| **Valeur par défaut** | `xslt_types text/xml;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Enables transformations in responses with the specified MIME types in addition to “`text/xml`”. The special value “`*`” matches any MIME type (0.8.29). If the transformation result is an HTML response, its MIME type is changed to “`text/html`”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

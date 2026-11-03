---
title: "slice"
description: "Directive nginx slice (ngx_http_slice_module) — Sets the size of the slice. The zero value disables splitting responses into slices. Note that a too low value may result in excessive memory usage and opening a large number of files. In order for a…"
tags: [nginx, directive, ngx_http_slice_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `slice size;` |
| **Valeur par défaut** | `slice 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_slice_module\|ngx_http_slice_module]] |

## Utilisation

Sets the *size* of the slice. The zero value disables splitting responses into slices. Note that a too low value may result in excessive memory usage and opening a large number of files.

In order for a subrequest to return the required range, the `$slice_range` variable should be [[12-directives/proxy-set-header|passed]] to the proxied server as the `Range` request header field. If [[12-directives/proxy-cache|caching]] is enabled, `$slice_range` should be added to the [[12-directives/proxy-cache-key|cache key]] and caching of responses with 206 status code should be [[12-directives/proxy-cache-valid|enabled]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

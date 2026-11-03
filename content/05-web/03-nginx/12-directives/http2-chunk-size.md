---
title: "http2_chunk_size"
description: "Directive nginx http2_chunk_size (ngx_http_v2_module) — Sets the maximum size of chunks into which the response body is sliced. A too low value results in higher overhead. A too high value impairs prioritization due to HOL blocking."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_chunk_size size;` |
| **Valeur par défaut** | `http2_chunk_size 8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

Sets the maximum size of chunks into which the response body is sliced. A too low value results in higher overhead. A too high value impairs prioritization due to [HOL blocking](http://en.wikipedia.org/wiki/Head-of-line_blocking).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

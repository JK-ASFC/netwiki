---
title: "gzip_disable"
description: "Directive nginx gzip_disable (ngx_http_gzip_module) — Disables gzipping of responses for requests with User-Agent header fields matching any of the specified regular expressions. The special mask “msie6” (0.7.12) corresponds to the regular expression…"
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_disable regex ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.6.23 |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Disables gzipping of responses for requests with `User-Agent` header fields matching any of the specified regular expressions.

The special mask “`msie6`” (0.7.12) corresponds to the regular expression “`MSIE [4-6]\.`”, but works faster. Starting from version 0.8.11, “`MSIE 6.0; ... SV1`” is excluded from this mask.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

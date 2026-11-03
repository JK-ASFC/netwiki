---
title: "gunzip"
description: "Directive nginx gunzip (ngx_http_gunzip_module) — Enables or disables decompression of gzipped responses for clients that lack gzip support. If enabled, the following directives are also taken into account when determining if clients support gzip:…"
tags: [nginx, directive, ngx_http_gunzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gunzip on \| off;` |
| **Valeur par défaut** | `gunzip off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gunzip_module\|ngx_http_gunzip_module]] |

## Utilisation

Enables or disables decompression of gzipped responses for clients that lack gzip support. If enabled, the following directives are also taken into account when determining if clients support gzip: [[12-directives/gzip-http-version|gzip_http_version]], [[12-directives/gzip-proxied|gzip_proxied]], and [[12-directives/gzip-disable|gzip_disable]]. See also the [[12-directives/gzip-vary|gzip_vary]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

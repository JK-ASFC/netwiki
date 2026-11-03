---
title: "gzip_min_length"
description: "Directive nginx gzip_min_length (ngx_http_gzip_module) — Sets the minimum length of a response that will be gzipped. The length is determined only from the Content-Length response header field."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_min_length length;` |
| **Valeur par défaut** | `gzip_min_length 20;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Sets the minimum length of a response that will be gzipped. The length is determined only from the `Content-Length` response header field.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

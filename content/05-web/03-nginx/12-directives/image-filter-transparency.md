---
title: "image_filter_transparency"
description: "Directive nginx image_filter_transparency (ngx_http_image_filter_module) — Defines whether transparency should be preserved when transforming GIF images or PNG images with colors specified by a palette. The loss of transparency results in images of a better quality. The…"
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_transparency on\|off;` |
| **Valeur par défaut** | `image_filter_transparency on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Defines whether transparency should be preserved when transforming GIF images or PNG images with colors specified by a palette. The loss of transparency results in images of a better quality. The alpha channel transparency in PNG is always preserved.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

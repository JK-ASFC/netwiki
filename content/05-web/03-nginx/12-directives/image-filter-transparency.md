---
title: "image_filter_transparency"
description: "Directive nginx image_filter_transparency (ngx_http_image_filter_module) — Indique si la transparence doit être conservée lors de la transformation des images GIF ou PNG à palette de couleurs. La perte de transparence donne des images de meilleure qualité. La transparence…"
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_transparency on\|off;` |
| **Valeur par défaut** | `image_filter_transparency on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Indique si la transparence doit être conservée lors de la transformation des images GIF ou PNG à palette de couleurs. La perte de transparence donne des images de meilleure qualité. La transparence par canal alpha des PNG est toujours conservée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

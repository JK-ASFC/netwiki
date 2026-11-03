---
title: "image_filter_webp_quality"
description: "Directive nginx image_filter_webp_quality (ngx_http_image_filter_module) — Définit la qualité (quality) souhaitée des images WebP transformées. Les valeurs acceptées vont de 1 à 100. Une valeur plus faible implique généralement une qualité d'image moindre et moins de…"
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_webp_quality quality;` |
| **Valeur par défaut** | `image_filter_webp_quality 80;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.11.6 |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Définit la qualité (*quality*) souhaitée des images WebP transformées. Les valeurs acceptées vont de 1 à 100. Une valeur plus faible implique généralement une qualité d'image moindre et moins de données à transférer. La valeur du paramètre peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

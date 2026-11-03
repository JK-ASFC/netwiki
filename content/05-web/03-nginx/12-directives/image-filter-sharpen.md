---
title: "image_filter_sharpen"
description: "Directive nginx image_filter_sharpen (ngx_http_image_filter_module) — Augmente la netteté de l'image finale. Le pourcentage de netteté peut dépasser 100. La valeur zéro désactive l'accentuation. La valeur du paramètre peut contenir des variables."
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_sharpen percent;` |
| **Valeur par défaut** | `image_filter_sharpen 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Augmente la netteté de l'image finale. Le pourcentage de netteté peut dépasser 100. La valeur zéro désactive l'accentuation. La valeur du paramètre peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

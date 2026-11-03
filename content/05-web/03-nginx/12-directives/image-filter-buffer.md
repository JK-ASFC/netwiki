---
title: "image_filter_buffer"
description: "Directive nginx image_filter_buffer (ngx_http_image_filter_module) — Définit la taille maximale du tampon utilisé pour lire les images. Au-delà, le serveur renvoie l'erreur 415 Unsupported Media Type."
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter_buffer size;` |
| **Valeur par défaut** | `image_filter_buffer 1M;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Définit la taille maximale du tampon utilisé pour lire les images. Au-delà, le serveur renvoie l'erreur `415 Unsupported Media Type`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

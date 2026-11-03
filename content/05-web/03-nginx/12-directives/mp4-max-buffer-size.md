---
title: "mp4_max_buffer_size"
description: "Directive nginx mp4_max_buffer_size (ngx_http_mp4_module) — Pendant le traitement des métadonnées, un tampon plus grand peut être nécessaire. Sa taille ne peut pas dépasser la taille (size) indiquée ; sinon, nginx renvoie l'erreur serveur 500 Internal Server…"
tags: [nginx, directive, ngx_http_mp4_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mp4_max_buffer_size size;` |
| **Valeur par défaut** | `mp4_max_buffer_size 10M;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mp4_module\|ngx_http_mp4_module]] |

## Utilisation

Pendant le traitement des métadonnées, un tampon plus grand peut être nécessaire. Sa taille ne peut pas dépasser la taille (*size*) indiquée ; sinon, nginx renvoie l'erreur serveur `500 Internal Server Error` et journalise le message suivant :

```nginx
"/some/movie/file.mp4" mp4 moov atom is too large:
12583268, you may want to increase mp4_max_buffer_size
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

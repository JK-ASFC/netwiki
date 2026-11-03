---
title: "gzip_min_length"
description: "Directive nginx gzip_min_length (ngx_http_gzip_module) — Définit la longueur minimale d'une réponse pour qu'elle soit compressée. La longueur est déterminée uniquement à partir du champ d'en-tête de réponse Content-Length."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_min_length length;` |
| **Valeur par défaut** | `gzip_min_length 20;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Définit la longueur minimale d'une réponse pour qu'elle soit compressée. La longueur est déterminée uniquement à partir du champ d'en-tête de réponse `Content-Length`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

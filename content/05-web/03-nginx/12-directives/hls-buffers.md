---
title: "hls_buffers"
description: "Directive nginx hls_buffers (ngx_http_hls_module) — Définit le nombre (number) et la taille (size) maximaux des tampons utilisés pour lire et écrire les trames de données."
tags: [nginx, directive, ngx_http_hls_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hls_buffers number size;` |
| **Valeur par défaut** | `hls_buffers 8 2m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_hls_module\|ngx_http_hls_module]] |

## Utilisation

Définit le nombre (*number*) et la taille (*size*) maximaux des tampons utilisés pour lire et écrire les trames de données.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

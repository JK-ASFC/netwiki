---
title: "hls_mp4_buffer_size"
description: "Directive nginx hls_mp4_buffer_size (ngx_http_hls_module) — Définit la taille (size) initiale du tampon utilisé pour traiter les fichiers MP4 et MOV."
tags: [nginx, directive, ngx_http_hls_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hls_mp4_buffer_size size;` |
| **Valeur par défaut** | `hls_mp4_buffer_size 512k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_hls_module\|ngx_http_hls_module]] |

## Utilisation

Définit la taille (*size*) initiale du tampon utilisé pour traiter les fichiers MP4 et MOV.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

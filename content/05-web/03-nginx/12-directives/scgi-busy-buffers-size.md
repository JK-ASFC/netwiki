---
title: "scgi_busy_buffers_size"
description: "Directive nginx scgi_busy_buffers_size (ngx_http_scgi_module) — Lorsque la mise en tampon des réponses du serveur SCGI est activée, limite la taille (size) totale des tampons occupés à envoyer la réponse au client tant qu'elle n'est pas entièrement lue. Pendant…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_busy_buffers_size size;` |
| **Valeur par défaut** | `scgi_busy_buffers_size 8k\|16k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Lorsque la [[12-directives/scgi-buffering|mise en tampon]] des réponses du serveur SCGI est activée, limite la taille (*size*) totale des tampons occupés à envoyer la réponse au client tant qu'elle n'est pas entièrement lue. Pendant ce temps, les autres tampons servent à lire la réponse et, si besoin, à en placer une partie dans un fichier temporaire. Par défaut, *size* est limitée à la taille de deux tampons définis par les directives [[12-directives/scgi-buffer-size|scgi_buffer_size]] et [[12-directives/scgi-buffers|scgi_buffers]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

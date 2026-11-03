---
title: "mp4_start_key_frame"
description: "Directive nginx mp4_start_key_frame (ngx_http_mp4_module) — Fait toujours commencer la vidéo de sortie par une image clé. Si l'argument start ne désigne pas une image clé, les premières images sont masquées à l'aide d'une liste de montage mp4. Les listes de…"
tags: [nginx, directive, ngx_http_mp4_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mp4_start_key_frame on \| off;` |
| **Valeur par défaut** | `mp4_start_key_frame off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.21.4 |
| **Module** | [[11-modules/02-http/ngx_http_mp4_module\|ngx_http_mp4_module]] |

## Utilisation

Fait toujours commencer la vidéo de sortie par une image clé. Si l'argument `start` ne désigne pas une image clé, les premières images sont masquées à l'aide d'une liste de montage mp4. Les listes de montage sont prises en charge par les principaux lecteurs et navigateurs comme Chrome, Safari, QuickTime et ffmpeg, et partiellement par Firefox.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

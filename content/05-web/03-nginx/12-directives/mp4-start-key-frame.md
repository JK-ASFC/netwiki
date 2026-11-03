---
title: "mp4_start_key_frame"
description: "Directive nginx mp4_start_key_frame (ngx_http_mp4_module) — Forces output video to always start with a key video frame. If the start argument does not point to a key frame, initial frames are hidden using an mp4 edit list. Edit lists are supported by major…"
tags: [nginx, directive, ngx_http_mp4_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mp4_start_key_frame on \| off;` |
| **Valeur par défaut** | `mp4_start_key_frame off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.21.4 |
| **Module** | [[11-modules/02-http/ngx_http_mp4_module\|ngx_http_mp4_module]] |

## Utilisation

Forces output video to always start with a key video frame. If the `start` argument does not point to a key frame, initial frames are hidden using an mp4 edit list. Edit lists are supported by major players and browsers such as Chrome, Safari, QuickTime and ffmpeg, partially supported by Firefox.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "js_fetch_max_response_buffer_size (ngx_stream_js_module)"
description: "Directive nginx js_fetch_max_response_buffer_size (ngx_stream_js_module) — Définit la taille (size) maximale de la réponse reçue avec l'API Fetch."
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_max_response_buffer_size size;` |
| **Valeur par défaut** | `js_fetch_max_response_buffer_size 1m;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.7.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Définit la taille (*size*) maximale de la réponse reçue avec l'[[10-guides/04-njs/reference|API Fetch]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

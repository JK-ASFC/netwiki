---
title: "js_fetch_keepalive_time (ngx_stream_js_module)"
description: "Directive nginx js_fetch_keepalive_time (ngx_stream_js_module) — Limite la durée maximale pendant laquelle des requêtes peuvent être traitées sur une connexion persistante avec l'API Fetch. Une fois cette durée atteinte, la connexion est fermée après le traitement…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_keepalive_time time;` |
| **Valeur par défaut** | `js_fetch_keepalive_time 1h;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.9.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Limite la durée maximale pendant laquelle des requêtes peuvent être traitées sur une connexion persistante avec l'[[10-guides/04-njs/reference|API Fetch]]. Une fois cette durée atteinte, la connexion est fermée après le traitement de la requête suivante.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "zone_sync_interval"
description: "Directive nginx zone_sync_interval (ngx_stream_zone_sync_module) — Définit l'intervalle d'interrogation des mises à jour dans une zone de mémoire partagée."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_interval time;` |
| **Valeur par défaut** | `zone_sync_interval 1s;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Définit l'intervalle d'interrogation des mises à jour dans une zone de mémoire partagée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

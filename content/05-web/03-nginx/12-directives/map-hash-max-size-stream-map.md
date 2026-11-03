---
title: "map_hash_max_size (ngx_stream_map_module)"
description: "Directive nginx map_hash_max_size (ngx_stream_map_module) — Définit la taille (size) maximale des tables de hachage des variables map. Le réglage des tables de hachage est détaillé dans un document distinct."
tags: [nginx, directive, ngx_stream_map_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `map_hash_max_size size;` |
| **Valeur par défaut** | `map_hash_max_size 2048;` |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_map_module\|ngx_stream_map_module]] |

## Utilisation

Définit la taille (*size*) maximale des tables de hachage des variables [[12-directives/map-stream-map|map]]. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

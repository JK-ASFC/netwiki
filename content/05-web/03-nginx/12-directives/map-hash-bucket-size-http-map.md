---
title: "map_hash_bucket_size (ngx_http_map_module)"
description: "Directive nginx map_hash_bucket_size (ngx_http_map_module) — Définit la taille des compartiments des tables de hachage des variables map. La valeur par défaut dépend de la taille de ligne de cache du processeur. Le réglage des tables de hachage est détaillé…"
tags: [nginx, directive, ngx_http_map_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `map_hash_bucket_size size;` |
| **Valeur par défaut** | `map_hash_bucket_size 32\|64\|128;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_map_module\|ngx_http_map_module]] |

## Utilisation

Définit la taille des compartiments des tables de hachage des variables [[12-directives/map-http-map|map]]. La valeur par défaut dépend de la taille de ligne de cache du processeur. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

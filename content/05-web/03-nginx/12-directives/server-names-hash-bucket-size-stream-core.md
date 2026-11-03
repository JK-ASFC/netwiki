---
title: "server_names_hash_bucket_size (ngx_stream_core_module)"
description: "Directive nginx server_names_hash_bucket_size (ngx_stream_core_module) — Définit la taille des compartiments des tables de hachage des noms de serveurs. La valeur par défaut dépend de la taille de ligne de cache du processeur. Le réglage des tables de hachage est détaillé…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_names_hash_bucket_size size;` |
| **Valeur par défaut** | `server_names_hash_bucket_size 32\|64\|128;` |
| **Contexte** | `stream` |
| **Apparue dans la version** | 1.25.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Définit la taille des compartiments des tables de hachage des noms de serveurs. La valeur par défaut dépend de la taille de ligne de cache du processeur. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

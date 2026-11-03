---
title: "server_names_hash_max_size (ngx_stream_core_module)"
description: "Directive nginx server_names_hash_max_size (ngx_stream_core_module) — Définit la taille (size) maximale des tables de hachage des noms de serveurs. Le réglage des tables de hachage est détaillé dans un document distinct."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_names_hash_max_size size;` |
| **Valeur par défaut** | `server_names_hash_max_size 512;` |
| **Contexte** | `stream` |
| **Apparue dans la version** | 1.25.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Définit la taille (*size*) maximale des tables de hachage des noms de serveurs. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

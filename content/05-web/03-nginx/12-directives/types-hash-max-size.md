---
title: "types_hash_max_size"
description: "Directive nginx types_hash_max_size (ngx_http_core_module) — Définit la taille (size) maximale des tables de hachage des types. Le réglage des tables de hachage est détaillé dans un document distinct."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `types_hash_max_size size;` |
| **Valeur par défaut** | `types_hash_max_size 1024;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la taille (*size*) maximale des tables de hachage des types. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

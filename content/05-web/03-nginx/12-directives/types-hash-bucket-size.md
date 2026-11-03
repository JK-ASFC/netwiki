---
title: "types_hash_bucket_size"
description: "Directive nginx types_hash_bucket_size (ngx_http_core_module) — Définit la taille des compartiments des tables de hachage des types. Le réglage des tables de hachage est détaillé dans un document distinct. NOTE Avant la version 1.5.13, la valeur par défaut…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `types_hash_bucket_size size;` |
| **Valeur par défaut** | `types_hash_bucket_size 64;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la taille des compartiments des tables de hachage des types. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

> [!NOTE]
> Avant la version 1.5.13, la valeur par défaut dépendait de la taille de ligne de cache du processeur.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

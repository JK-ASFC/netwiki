---
title: "referer_hash_bucket_size"
description: "Directive nginx referer_hash_bucket_size (ngx_http_referer_module) — Définit la taille des compartiments des tables de hachage des référents valides. Le réglage des tables de hachage est détaillé dans un document distinct."
tags: [nginx, directive, ngx_http_referer_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `referer_hash_bucket_size size;` |
| **Valeur par défaut** | `referer_hash_bucket_size 64;` |
| **Contexte** | `server`, `location` |
| **Apparue dans la version** | 1.0.5 |
| **Module** | [[11-modules/02-http/ngx_http_referer_module\|ngx_http_referer_module]] |

## Utilisation

Définit la taille des compartiments des tables de hachage des référents valides. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

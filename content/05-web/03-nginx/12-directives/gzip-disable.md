---
title: "gzip_disable"
description: "Directive nginx gzip_disable (ngx_http_gzip_module) — Désactive la compression gzip des réponses pour les requêtes dont le champ d'en-tête User-Agent correspond à l'une des expressions régulières indiquées. Le masque spécial « msie6 » (0.7.12)…"
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_disable regex ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.6.23 |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Désactive la compression gzip des réponses pour les requêtes dont le champ d'en-tête `User-Agent` correspond à l'une des expressions régulières indiquées.

Le masque spécial « `msie6` » (0.7.12) correspond à l'expression régulière « `MSIE [4-6]\.` », mais il est plus rapide. Depuis la version 0.8.11, « `MSIE 6.0; ... SV1` » est exclu de ce masque.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

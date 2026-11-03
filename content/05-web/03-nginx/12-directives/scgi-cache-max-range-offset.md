---
title: "scgi_cache_max_range_offset"
description: "Directive nginx scgi_cache_max_range_offset (ngx_http_scgi_module) — Définit un décalage en octets pour les requêtes de plages d'octets. Si la plage se situe au-delà de ce décalage, la requête est transmise au serveur SCGI et la réponse n'est pas mise en cache."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_cache_max_range_offset number;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.11.6 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Définit un décalage en octets pour les requêtes de plages d'octets. Si la plage se situe au-delà de ce décalage, la requête est transmise au serveur SCGI et la réponse n'est pas mise en cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

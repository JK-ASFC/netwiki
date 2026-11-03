---
title: "etag"
description: "Directive nginx etag (ngx_http_core_module) — Active ou désactive la génération automatique du champ d'en-tête de réponse ETag pour les ressources statiques."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `etag on \| off;` |
| **Valeur par défaut** | `etag on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.3.3 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive la génération automatique du champ d'en-tête de réponse `ETag` pour les ressources statiques.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

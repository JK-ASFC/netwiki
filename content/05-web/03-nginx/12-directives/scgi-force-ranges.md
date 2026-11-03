---
title: "scgi_force_ranges"
description: "Directive nginx scgi_force_ranges (ngx_http_scgi_module) — Active la prise en charge des plages d'octets pour les réponses du serveur SCGI, en cache ou non, quel que soit le champ Accept-Ranges de ces réponses."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_force_ranges on \| off;` |
| **Valeur par défaut** | `scgi_force_ranges off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.7 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Active la prise en charge des plages d'octets pour les réponses du serveur SCGI, en cache ou non, quel que soit le champ `Accept-Ranges` de ces réponses.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

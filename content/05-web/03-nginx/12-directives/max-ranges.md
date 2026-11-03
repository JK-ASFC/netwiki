---
title: "max_ranges"
description: "Directive nginx max_ranges (ngx_http_core_module) — Limite le nombre maximal de plages autorisées dans les requêtes de plages d'octets. Les requêtes qui dépassent la limite sont traitées comme si aucune plage n'était indiquée. Par défaut, le nombre de…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `max_ranges number;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.2 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Limite le nombre maximal de plages autorisées dans les requêtes de plages d'octets. Les requêtes qui dépassent la limite sont traitées comme si aucune plage n'était indiquée. Par défaut, le nombre de plages n'est pas limité. La valeur zéro désactive complètement la prise en charge des plages d'octets.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "json_max_depth"
description: "Directive nginx json_max_depth (ngx_http_json_module) — Définit la profondeur d'imbrication maximale des documents JSON. Un document plus profondément imbriqué est considéré comme non valide. Les valeurs acceptées vont de 1 à 256."
tags: [nginx, directive, ngx_http_json_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `json_max_depth number;` |
| **Valeur par défaut** | `json_max_depth 32;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_json_module\|ngx_http_json_module]] |

## Utilisation

Définit la profondeur d'imbrication maximale des documents JSON. Un document plus profondément imbriqué est considéré comme non valide. Les valeurs acceptées vont de 1 à 256.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

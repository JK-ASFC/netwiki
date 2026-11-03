---
title: "js_content"
description: "Directive nginx js_content (ngx_http_js_module) — Définit une fonction njs comme gestionnaire de contenu d'un bloc location. Depuis la version 0.4.0, on peut faire référence à une fonction de module. NOTE La directive peut être indiquée dans un bloc…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_content module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit une fonction njs comme gestionnaire de contenu d'un bloc location. Depuis la version 0.4.0, on peut faire référence à une fonction de module.

> [!NOTE]
> La directive peut être indiquée dans un bloc [[12-directives/if|if]] depuis la version 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

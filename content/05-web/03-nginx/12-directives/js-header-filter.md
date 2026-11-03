---
title: "js_header_filter"
description: "Directive nginx js_header_filter (ngx_http_js_module) — Définit une fonction njs comme filtre de l'en-tête de réponse. La directive permet de modifier n'importe quel champ de l'en-tête de réponse. NOTE Comme le gestionnaire js_header_filter renvoie son…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_header_filter module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Apparue dans la version** | 0.5.1 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit une fonction njs comme filtre de l'en-tête de réponse. La directive permet de modifier n'importe quel champ de l'en-tête de réponse.

> [!NOTE]
> Comme le gestionnaire `js_header_filter` renvoie son résultat immédiatement, il ne prend en charge que les opérations synchrones. Les opérations asynchrones comme [[10-guides/04-njs/reference|r.subrequest()]] ou [[10-guides/04-njs/reference|setTimeout()]] ne sont donc pas prises en charge.

> [!NOTE]
> La directive peut être indiquée dans un bloc [[12-directives/if|if]] depuis la version 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

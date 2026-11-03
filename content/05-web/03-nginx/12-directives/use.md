---
title: "use"
description: "Directive nginx use (ngx_core_module) — Indique la méthode (method) de traitement des connexions à utiliser. Il n'est normalement pas nécessaire de l'indiquer, car nginx utilise par défaut la méthode la plus efficace."
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `use method;` |
| **Valeur par défaut** | — |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Indique la méthode (*method*) de [[10-guides/01-introduction/events|traitement des connexions]] à utiliser. Il n'est normalement pas nécessaire de l'indiquer, car nginx utilise par défaut la méthode la plus efficace.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

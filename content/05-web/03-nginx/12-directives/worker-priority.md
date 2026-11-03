---
title: "worker_priority"
description: "Directive nginx worker_priority (ngx_core_module) — Définit la priorité d'ordonnancement des processus de travail, comme la commande nice : un nombre (number) négatif signifie une priorité plus élevée. La plage autorisée va normalement de -20 à 20.…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_priority number;` |
| **Valeur par défaut** | `worker_priority 0;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Définit la priorité d'ordonnancement des processus de travail, comme la commande `nice` : un nombre (*number*) négatif signifie une priorité plus élevée. La plage autorisée va normalement de -20 à 20.

Exemple :

```nginx
worker_priority -10;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

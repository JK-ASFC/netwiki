---
title: "worker_shutdown_timeout"
description: "Directive nginx worker_shutdown_timeout (ngx_core_module) — Configure un délai pour l'arrêt en douceur des processus de travail. Une fois ce délai (time) écoulé, nginx tente de fermer toutes les connexions encore ouvertes pour faciliter l'arrêt."
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_shutdown_timeout time;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Apparue dans la version** | 1.11.11 |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Configure un délai pour l'arrêt en douceur des processus de travail. Une fois ce délai (*time*) écoulé, nginx tente de fermer toutes les connexions encore ouvertes pour faciliter l'arrêt.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

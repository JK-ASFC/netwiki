---
title: "worker_aio_requests"
description: "Directive nginx worker_aio_requests (ngx_core_module) — Avec aio et la méthode de traitement des connexions epoll, définit le nombre (number) maximal d'opérations d'entrée-sortie asynchrones en cours pour un processus de travail."
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_aio_requests number;` |
| **Valeur par défaut** | `worker_aio_requests 32;` |
| **Contexte** | `events` |
| **Apparue dans la version** | 1.1.4, 1.0.7 |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Avec [[12-directives/aio|aio]] et la méthode de traitement des connexions `epoll`, définit le nombre (*number*) maximal d'opérations d'entrée-sortie asynchrones en cours pour un processus de travail.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

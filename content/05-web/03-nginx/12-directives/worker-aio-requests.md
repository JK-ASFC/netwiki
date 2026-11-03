---
title: "worker_aio_requests"
description: "Directive nginx worker_aio_requests (Core functionality) — When using aio with the epoll connection processing method, sets the maximum number of outstanding asynchronous I/O operations for a single worker process."
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_aio_requests number;` |
| **Valeur par défaut** | `worker_aio_requests 32;` |
| **Contexte** | `events` |
| **Apparue dans la version** | 1.1.4, 1.0.7 |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

When using [[12-directives/aio|aio]] with the `epoll` connection processing method, sets the maximum *number* of outstanding asynchronous I/O operations for a single worker process.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

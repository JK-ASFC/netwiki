---
title: "thread_pool"
description: "Directive nginx thread_pool (Core functionality) — Defines the name and parameters of a thread pool used for multi-threaded reading and sending of files without blocking worker processes. The threads parameter defines the number of threads in the…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `thread_pool name threads=number [max_queue=number];` |
| **Valeur par défaut** | `thread_pool default threads=32 max_queue=65536;` |
| **Contexte** | `main` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Defines the *name* and parameters of a thread pool used for multi-threaded reading and sending of files [[12-directives/aio|without blocking]] worker processes.

The `threads` parameter defines the number of threads in the pool.

In the event that all threads in the pool are busy, a new task will wait in the queue. The `max_queue` parameter limits the number of tasks allowed to be waiting in the queue. By default, up to 65536 tasks can wait in the queue. When the queue overflows, the task is completed with an error.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

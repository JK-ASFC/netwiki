---
title: "accept_mutex"
description: "Directive nginx accept_mutex (Core functionality) — If accept_mutex is enabled, worker processes will accept new connections by turn. Otherwise, all worker processes will be notified about new connections, and if volume of new connections is low, some…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `accept_mutex on \| off;` |
| **Valeur par défaut** | `accept_mutex off;` |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

If `accept_mutex` is enabled, worker processes will accept new connections by turn. Otherwise, all worker processes will be notified about new connections, and if volume of new connections is low, some of the worker processes may just waste system resources.

> [!NOTE]
> There is no need to enable `accept_mutex` on systems that support the [[10-guides/01-introduction/events|EPOLLEXCLUSIVE]] flag (1.11.3) or when using [[11-modules/02-http/ngx_http_core_module|ngx_http_core_module]].

> [!NOTE]
> Prior to version 1.11.3, the default value was `on`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

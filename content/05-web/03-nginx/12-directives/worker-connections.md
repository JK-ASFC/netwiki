---
title: "worker_connections"
description: "Directive nginx worker_connections (Core functionality) — Sets the maximum number of simultaneous connections that can be opened by a worker process. It should be kept in mind that this number includes all connections (e.g. connections with proxied servers,…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_connections number;` |
| **Valeur par défaut** | `worker_connections 512;` |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Sets the maximum number of simultaneous connections that can be opened by a worker process.

It should be kept in mind that this number includes all connections (e.g. connections with proxied servers, among others), not only connections with clients. Another consideration is that the actual number of simultaneous connections cannot exceed the current limit on the maximum number of open files, which can be changed by [[12-directives/worker-rlimit-nofile|worker_rlimit_nofile]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

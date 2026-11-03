---
title: "worker_processes"
description: "Directive nginx worker_processes (Core functionality) — Defines the number of worker processes. The optimal value depends on many factors including (but not limited to) the number of CPU cores, the number of hard disk drives that store data, and load…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_processes number \| auto;` |
| **Valeur par défaut** | `worker_processes 1;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Defines the number of worker processes.

The optimal value depends on many factors including (but not limited to) the number of CPU cores, the number of hard disk drives that store data, and load pattern. When one is in doubt, setting it to the number of available CPU cores would be a good start (the value “`auto`” will try to autodetect it).

> [!NOTE]
> The `auto` parameter is supported starting from versions 1.3.8 and 1.2.5.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

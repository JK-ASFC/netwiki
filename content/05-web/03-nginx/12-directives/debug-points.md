---
title: "debug_points"
description: "Directive nginx debug_points (Core functionality) — This directive is used for debugging. When internal error is detected, e.g. the leak of sockets on restart of working processes, enabling debug_points leads to a core file creation (abort) or to…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `debug_points abort \| stop;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

This directive is used for debugging.

When internal error is detected, e.g. the leak of sockets on restart of working processes, enabling `debug_points` leads to a core file creation (`abort`) or to stopping of a process (`stop`) for further analysis using a system debugger.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "user"
description: "Directive nginx user (Core functionality) — Defines user and group credentials used by worker processes. If group is omitted, a group whose name equals that of user is used."
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `user user [group];` |
| **Valeur par défaut** | `user nobody nobody;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Defines *user* and *group* credentials used by worker processes. If *group* is omitted, a group whose name equals that of *user* is used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "multi_accept"
description: "Directive nginx multi_accept (Core functionality) — If multi_accept is disabled, a worker process will accept one new connection at a time. Otherwise, a worker process will accept all new connections at a time. NOTE The directive is ignored if…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `multi_accept on \| off;` |
| **Valeur par défaut** | `multi_accept off;` |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

If `multi_accept` is disabled, a worker process will accept one new connection at a time. Otherwise, a worker process will accept all new connections at a time.

> [!NOTE]
> The directive is ignored if [[10-guides/01-introduction/events|Connection processing methods]] connection processing method is used, because it reports the number of new connections waiting to be accepted.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

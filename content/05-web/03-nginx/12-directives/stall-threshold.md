---
title: "stall_threshold"
description: "Directive nginx stall_threshold (Core functionality) — Allows overriding the default time threshold for the event loop iteration before a stall is reported. By default, a stall is reported when an event loop iteration exceeds 1000ms. If the…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `stall_threshold time;` |
| **Valeur par défaut** | `stall_threshold 1000ms;` |
| **Contexte** | `events` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Allows overriding the default time threshold for the event loop iteration before a stall is reported. By default, a stall is reported when an event loop iteration exceeds *1000ms*. If the [[12-directives/timer-resolution|timer_resolution]] directive is enabled, the time threshold will be ignored.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

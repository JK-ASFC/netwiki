---
title: "stall_threshold"
description: "Directive nginx stall_threshold (ngx_core_module) — Permet de modifier le seuil de durée d'une itération de la boucle d'événements au-delà duquel un blocage est signalé. Par défaut, un blocage est signalé lorsqu'une itération dépasse 1000ms. Si la…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `stall_threshold time;` |
| **Valeur par défaut** | `stall_threshold 1000ms;` |
| **Contexte** | `events` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Permet de modifier le seuil de durée d'une itération de la boucle d'événements au-delà duquel un blocage est signalé. Par défaut, un blocage est signalé lorsqu'une itération dépasse *1000ms*. Si la directive [[12-directives/timer-resolution|timer_resolution]] est activée, ce seuil est ignoré.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

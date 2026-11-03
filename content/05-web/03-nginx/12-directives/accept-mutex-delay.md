---
title: "accept_mutex_delay"
description: "Directive nginx accept_mutex_delay (ngx_core_module) — Si accept_mutex est activé, indique la durée maximale pendant laquelle un processus de travail attend avant de réessayer d'accepter de nouvelles connexions lorsqu'un autre processus de travail est en…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `accept_mutex_delay time;` |
| **Valeur par défaut** | `accept_mutex_delay 500ms;` |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Si [[12-directives/accept-mutex|accept_mutex]] est activé, indique la durée maximale pendant laquelle un processus de travail attend avant de réessayer d'accepter de nouvelles connexions lorsqu'un autre processus de travail est en train d'en accepter.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

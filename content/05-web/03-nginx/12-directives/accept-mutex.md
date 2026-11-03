---
title: "accept_mutex"
description: "Directive nginx accept_mutex (ngx_core_module) — Si accept_mutex est activé, les processus de travail acceptent les nouvelles connexions à tour de rôle. Sinon, tous les processus de travail sont avertis des nouvelles connexions et, si elles sont…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `accept_mutex on \| off;` |
| **Valeur par défaut** | `accept_mutex off;` |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Si `accept_mutex` est activé, les processus de travail acceptent les nouvelles connexions à tour de rôle. Sinon, tous les processus de travail sont avertis des nouvelles connexions et, si elles sont peu nombreuses, certains processus gaspillent simplement des ressources système.

> [!NOTE]
> Il est inutile d'activer `accept_mutex` sur les systèmes qui prennent en charge l'option [[10-guides/01-introduction/events|EPOLLEXCLUSIVE]] (1.11.3) ou lorsque [[11-modules/02-http/ngx_http_core_module|reuseport]] est utilisé.

> [!NOTE]
> Avant la version 1.11.3, la valeur par défaut était `on`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

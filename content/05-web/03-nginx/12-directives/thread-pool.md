---
title: "thread_pool"
description: "Directive nginx thread_pool (ngx_core_module) — Définit le nom (name) et les paramètres d'un groupe de threads utilisé pour lire et envoyer des fichiers en plusieurs threads sans bloquer les processus de travail. Le paramètre threads définit le…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `thread_pool name threads=number [max_queue=number];` |
| **Valeur par défaut** | `thread_pool default threads=32 max_queue=65536;` |
| **Contexte** | `main` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Définit le nom (*name*) et les paramètres d'un groupe de threads utilisé pour lire et envoyer des fichiers en plusieurs threads [[12-directives/aio|sans bloquer]] les processus de travail.

Le paramètre `threads` définit le nombre de threads du groupe.

Si tous les threads du groupe sont occupés, une nouvelle tâche attend dans la file. Le paramètre `max_queue` limite le nombre de tâches autorisées à attendre. Par défaut, jusqu'à 65536 tâches peuvent attendre. Lorsque la file déborde, la tâche se termine en erreur.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

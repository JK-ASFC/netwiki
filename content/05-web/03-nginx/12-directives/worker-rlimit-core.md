---
title: "worker_rlimit_core"
description: "Directive nginx worker_rlimit_core (ngx_core_module) — Modifie la limite de taille maximale d'un fichier core (RLIMIT_CORE) pour les processus de travail. Permet d'augmenter la limite sans redémarrer le processus maître."
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_rlimit_core size;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Modifie la limite de taille maximale d'un fichier core (`RLIMIT_CORE`) pour les processus de travail. Permet d'augmenter la limite sans redémarrer le processus maître.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

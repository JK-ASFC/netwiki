---
title: "worker_rlimit_nofile"
description: "Directive nginx worker_rlimit_nofile (ngx_core_module) — Modifie la limite du nombre maximal de fichiers ouverts (RLIMIT_NOFILE) pour les processus de travail. Permet d'augmenter la limite sans redémarrer le processus maître."
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_rlimit_nofile number;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Modifie la limite du nombre maximal de fichiers ouverts (`RLIMIT_NOFILE`) pour les processus de travail. Permet d'augmenter la limite sans redémarrer le processus maître.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

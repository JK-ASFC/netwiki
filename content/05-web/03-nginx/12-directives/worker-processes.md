---
title: "worker_processes"
description: "Directive nginx worker_processes (ngx_core_module) — Définit le nombre de processus de travail. La valeur optimale dépend de nombreux facteurs, notamment (mais pas seulement) du nombre de cœurs de processeur, du nombre de disques qui stockent les…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_processes number \| auto;` |
| **Valeur par défaut** | `worker_processes 1;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Définit le nombre de processus de travail.

La valeur optimale dépend de nombreux facteurs, notamment (mais pas seulement) du nombre de cœurs de processeur, du nombre de disques qui stockent les données et du profil de charge. Dans le doute, le nombre de cœurs disponibles est un bon point de départ (la valeur « `auto` » tente de le détecter automatiquement).

> [!NOTE]
> Le paramètre `auto` est pris en charge à partir des versions 1.3.8 et 1.2.5.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

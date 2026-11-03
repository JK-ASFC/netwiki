---
title: "working_directory"
description: "Directive nginx working_directory (ngx_core_module) — Définit le répertoire de travail courant d'un processus de travail. Il sert surtout à l'écriture d'un fichier core : le processus de travail doit alors avoir le droit d'écriture sur ce répertoire."
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `working_directory directory;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Définit le répertoire de travail courant d'un processus de travail. Il sert surtout à l'écriture d'un fichier core : le processus de travail doit alors avoir le droit d'écriture sur ce répertoire.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "user"
description: "Directive nginx user (ngx_core_module) — Définit l'utilisateur (user) et le groupe (group) sous lesquels s'exécutent les processus de travail. Si group est omis, le groupe portant le même nom que user est utilisé."
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `user user [group];` |
| **Valeur par défaut** | `user nobody nobody;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Définit l'utilisateur (*user*) et le groupe (*group*) sous lesquels s'exécutent les processus de travail. Si *group* est omis, le groupe portant le même nom que *user* est utilisé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

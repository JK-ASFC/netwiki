---
title: "debug_points"
description: "Directive nginx debug_points (ngx_core_module) — Cette directive sert au débogage. Lorsqu'une erreur interne est détectée, par exemple une fuite de sockets au redémarrage des processus de travail, l'activation de debug_points provoque la création…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `debug_points abort \| stop;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Cette directive sert au débogage.

Lorsqu'une erreur interne est détectée, par exemple une fuite de sockets au redémarrage des processus de travail, l'activation de `debug_points` provoque la création d'un fichier core (`abort`) ou l'arrêt du processus (`stop`) pour une analyse ultérieure avec un débogueur système.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

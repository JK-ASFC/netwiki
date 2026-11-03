---
title: "worker_connections"
description: "Directive nginx worker_connections (ngx_core_module) — Définit le nombre maximal de connexions simultanées qu'un processus de travail peut ouvrir. Ce nombre inclut toutes les connexions (par exemple celles vers les serveurs mandatés), pas seulement les…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_connections number;` |
| **Valeur par défaut** | `worker_connections 512;` |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Définit le nombre maximal de connexions simultanées qu'un processus de travail peut ouvrir.

Ce nombre inclut toutes les connexions (par exemple celles vers les serveurs mandatés), pas seulement les connexions des clients. Par ailleurs, le nombre réel de connexions simultanées ne peut pas dépasser la limite actuelle du nombre maximal de fichiers ouverts, modifiable avec [[12-directives/worker-rlimit-nofile|worker_rlimit_nofile]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

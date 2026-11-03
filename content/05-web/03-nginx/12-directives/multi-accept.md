---
title: "multi_accept"
description: "Directive nginx multi_accept (ngx_core_module) — Si multi_accept est désactivé, un processus de travail accepte une seule nouvelle connexion à la fois. Sinon, il accepte toutes les nouvelles connexions d'un coup. NOTE La directive est ignorée avec…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `multi_accept on \| off;` |
| **Valeur par défaut** | `multi_accept off;` |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Si `multi_accept` est désactivé, un processus de travail accepte une seule nouvelle connexion à la fois. Sinon, il accepte toutes les nouvelles connexions d'un coup.

> [!NOTE]
> La directive est ignorée avec la méthode de traitement des connexions [[10-guides/01-introduction/events|kqueue]], car celle-ci indique le nombre de nouvelles connexions en attente d'acceptation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

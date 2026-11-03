---
title: "sub_filter"
description: "Directive nginx sub_filter (ngx_http_sub_module) — Définit la chaîne à remplacer et la chaîne de remplacement. La chaîne à remplacer est recherchée sans tenir compte de la casse. La chaîne à remplacer (1.9.4) et la chaîne de remplacement peuvent…"
tags: [nginx, directive, ngx_http_sub_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sub_filter string replacement;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_sub_module\|ngx_http_sub_module]] |

## Utilisation

Définit la chaîne à remplacer et la chaîne de remplacement. La chaîne à remplacer est recherchée sans tenir compte de la casse. La chaîne à remplacer (1.9.4) et la chaîne de remplacement peuvent contenir des variables. Plusieurs directives `sub_filter` peuvent être indiquées au même niveau de configuration (1.9.4). Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `sub_filter` n'est définie au niveau courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

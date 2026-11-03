---
title: "add_after_body"
description: "Directive nginx add_after_body (ngx_http_addition_module) — Ajoute après le corps de la réponse le texte renvoyé par le traitement de la sous-requête indiquée. Une chaîne vide (\"\") en paramètre annule l'ajout hérité du niveau de configuration précédent."
tags: [nginx, directive, ngx_http_addition_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `add_after_body uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_addition_module\|ngx_http_addition_module]] |

## Utilisation

Ajoute après le corps de la réponse le texte renvoyé par le traitement de la sous-requête indiquée. Une chaîne vide (`""`) en paramètre annule l'ajout hérité du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

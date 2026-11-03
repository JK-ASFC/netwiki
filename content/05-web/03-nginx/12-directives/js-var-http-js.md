---
title: "js_var (ngx_http_js_module)"
description: "Directive nginx js_var (ngx_http_js_module) — Déclare une variable modifiable. La valeur peut contenir du texte, des variables ou une combinaison des deux. Contrairement aux variables créées avec la directive set, la variable n'est pas écrasée…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_var $variable [value];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.5.3 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Déclare une variable [[10-guides/04-njs/reference|modifiable]]. La valeur peut contenir du texte, des variables ou une combinaison des deux. Contrairement aux variables créées avec la directive [[12-directives/set-http-rewrite|set]], la variable n'est pas écrasée après une redirection.

> [!NOTE]
> La directive peut être indiquée aux niveaux `server` et `location` depuis la version 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

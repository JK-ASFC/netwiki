---
title: "js_var (ngx_stream_js_module)"
description: "Directive nginx js_var (ngx_stream_js_module) — Déclare une variable modifiable. La valeur peut contenir du texte, des variables et leur combinaison. NOTE La directive peut être indiquée au niveau server depuis la version 0.7.7."
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_var $variable [value];` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.5.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Déclare une variable [[10-guides/04-njs/reference|modifiable]]. La valeur peut contenir du texte, des variables et leur combinaison.

> [!NOTE]
> La directive peut être indiquée au niveau `server` depuis la version 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

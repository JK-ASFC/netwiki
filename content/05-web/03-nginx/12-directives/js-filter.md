---
title: "js_filter"
description: "Directive nginx js_filter (ngx_stream_js_module) — Définit un filtre de données. Depuis la version 0.4.0, une fonction de module peut être référencée. La fonction de filtre est appelée une fois, au moment où la session stream atteint la phase de…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_filter module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Définit un filtre de données. Depuis la version 0.4.0, une fonction de module peut être référencée. La fonction de filtre est appelée une fois, au moment où la session stream atteint la phase de [[10-guides/03-stream/stream-processing|contenu]].

La fonction de filtre reçoit les arguments suivants :

- **`s`**

  l'objet [[10-guides/04-njs/reference|Stream Session]]

À cette phase, on peut effectuer une initialisation ou enregistrer, avec la méthode [[10-guides/04-njs/reference|s.on()]], une fonction de rappel pour chaque bloc de données entrant. La méthode [[10-guides/04-njs/reference|s.off()]] permet de désenregistrer une fonction de rappel et d'arrêter le filtrage.

> [!NOTE]
> Comme le gestionnaire `js_filter` renvoie son résultat immédiatement, il ne prend en charge que les opérations synchrones. Les opérations asynchrones comme [[10-guides/04-njs/reference|ngx.fetch()]] ou [[10-guides/04-njs/reference|setTimeout()]] ne sont donc pas prises en charge.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "js_access (ngx_stream_js_module)"
description: "Directive nginx js_access (ngx_stream_js_module) — Définit une fonction njs appelée à la phase d'accès. Depuis la version 0.4.0, une fonction de module peut être référencée. La fonction est appelée une fois, au moment où la session stream atteint…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_access module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Définit une fonction njs appelée à la phase d'[[10-guides/03-stream/stream-processing|accès]]. Depuis la version 0.4.0, une fonction de module peut être référencée.

La fonction est appelée une fois, au moment où la session stream atteint pour la première fois la phase d'[[10-guides/03-stream/stream-processing|accès]]. Elle reçoit les arguments suivants :

- **`s`**

  l'objet [[10-guides/04-njs/reference|Stream Session]]

À cette phase, on peut effectuer une initialisation ou enregistrer, avec la méthode [[10-guides/04-njs/reference|s.on()]], une fonction de rappel pour chaque bloc de données entrant, jusqu'à l'appel de l'une des méthodes suivantes : [[10-guides/04-njs/reference|s.allow()]], [[10-guides/04-njs/reference|s.decline()]], [[10-guides/04-njs/reference|s.done()]]. Dès que l'une d'elles est appelée, le traitement de la session stream passe à la [[10-guides/03-stream/stream-processing|phase suivante]] et toutes les fonctions de rappel [[10-guides/04-njs/reference|s.on()]] en cours sont abandonnées.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

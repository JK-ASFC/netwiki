---
title: "js_preread"
description: "Directive nginx js_preread (ngx_stream_js_module) — Définit une fonction njs appelée à la phase de prélecture. Depuis la version 0.4.0, une fonction de module peut être référencée. La fonction est appelée une fois, au moment où la session stream…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_preread module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Définit une fonction njs appelée à la phase de [[10-guides/03-stream/stream-processing|prélecture]]. Depuis la version 0.4.0, une fonction de module peut être référencée.

La fonction est appelée une fois, au moment où la session stream atteint pour la première fois la phase de [[10-guides/03-stream/stream-processing|prélecture]]. Elle reçoit les arguments suivants :

- **`s`**

  l'objet [[10-guides/04-njs/reference|Stream Session]]

À cette phase, on peut effectuer une initialisation ou enregistrer, avec la méthode [[10-guides/04-njs/reference|s.on()]], une fonction de rappel pour chaque bloc de données entrant, jusqu'à l'appel de l'une des méthodes suivantes : [[10-guides/04-njs/reference|s.allow()]], [[10-guides/04-njs/reference|s.decline()]], [[10-guides/04-njs/reference|s.done()]]. Quand l'une d'elles est appelée, la session stream passe à la [[10-guides/03-stream/stream-processing|phase suivante]] et toutes les fonctions de rappel [[10-guides/04-njs/reference|s.on()]] en cours sont abandonnées.

> [!NOTE]
> Comme le gestionnaire `js_preread` renvoie son résultat immédiatement, il ne prend en charge que les fonctions de rappel synchrones. Les fonctions asynchrones comme [[10-guides/04-njs/reference|ngx.fetch()]] ou [[10-guides/04-njs/reference|setTimeout()]] ne sont donc pas prises en charge. Les opérations asynchrones sont en revanche possibles dans les fonctions de rappel [[10-guides/04-njs/reference|s.on()]] de la phase de [[10-guides/03-stream/stream-processing|prélecture]]. Voir [cet exemple](https://github.com/nginx/njs-examples#authorizing-connections-using-ngx-fetch-as-auth-request-stream-auth-request) pour plus d'informations.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "http2_push"
description: "Directive nginx http2_push (ngx_http_v2_module) — NOTE Cette directive est obsolète depuis la version 1.25.1. On peut utiliser à la place la directive early_hints. Envoie par anticipation (push) une requête vers l'uri indiqué en même temps que la…"
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_push uri \| off;` |
| **Valeur par défaut** | `http2_push off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.13.9 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> Cette directive est obsolète depuis la version 1.25.1. On peut utiliser à la place la directive [[12-directives/early-hints|early_hints]].

Envoie par anticipation ([push](https://datatracker.ietf.org/doc/html/rfc9113#section-8.4)) une requête vers l'*uri* indiqué en même temps que la réponse à la requête d'origine. Seuls les URI relatifs avec un chemin absolu sont traités, par exemple :

```nginx
http2_push /static/css/main.css;
```

La valeur *uri* peut contenir des variables.

Plusieurs directives `http2_push` peuvent être indiquées au même niveau de configuration. Le paramètre `off` annule l'effet des directives `http2_push` héritées du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "add_trailer"
description: "Directive nginx add_trailer (ngx_http_headers_module) — Ajoute le champ indiqué à la fin de la réponse si le code de réponse vaut 200, 201, 206, 301, 302, 303, 307 ou 308. La valeur du paramètre peut contenir des variables. Il peut y avoir plusieurs…"
tags: [nginx, directive, ngx_http_headers_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `add_trailer name value [always];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Apparue dans la version** | 1.13.2 |
| **Module** | [[11-modules/02-http/ngx_http_headers_module\|ngx_http_headers_module]] |

## Utilisation

Ajoute le champ indiqué à la fin de la réponse si le code de réponse vaut 200, 201, 206, 301, 302, 303, 307 ou 308. La valeur du paramètre peut contenir des variables.

Il peut y avoir plusieurs directives `add_trailer`. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `add_trailer` n'est définie au niveau courant. Les règles d'héritage peuvent être modifiées avec la directive [[12-directives/add-trailer-inherit|add_trailer_inherit]] (1.29.3).

Avec le paramètre `always`, le champ indiqué est ajouté quel que soit le code de réponse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

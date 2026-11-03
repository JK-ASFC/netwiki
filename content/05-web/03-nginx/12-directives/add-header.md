---
title: "add_header"
description: "Directive nginx add_header (ngx_http_headers_module) — Ajoute le champ indiqué à l'en-tête de réponse si le code de réponse vaut 200, 201 (1.3.10), 204, 206, 301, 302, 303, 304, 307 (1.1.16, 1.0.13) ou 308 (1.13.0). La valeur du paramètre peut contenir…"
tags: [nginx, directive, ngx_http_headers_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `add_header name value [always];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_headers_module\|ngx_http_headers_module]] |

## Utilisation

Ajoute le champ indiqué à l'en-tête de réponse si le code de réponse vaut 200, 201 (1.3.10), 204, 206, 301, 302, 303, 304, 307 (1.1.16, 1.0.13) ou 308 (1.13.0). La valeur du paramètre peut contenir des variables.

Il peut y avoir plusieurs directives `add_header`. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `add_header` n'est définie au niveau courant. Les règles d'héritage peuvent être modifiées avec la directive [[12-directives/add-header-inherit|add_header_inherit]] (1.29.3).

Avec le paramètre `always` (1.7.5), le champ d'en-tête est ajouté quel que soit le code de réponse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

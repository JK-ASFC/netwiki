---
title: "status_zone (ngx_http_api_module)"
description: "Directive nginx status_zone (ngx_http_api_module) — Active la collecte des informations d'état des serveurs virtuels http ou stream dans la zone indiquée. Plusieurs serveurs peuvent partager la même zone. Depuis la version 1.17.0, les informations…"
tags: [nginx, directive, ngx_http_api_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `status_zone zone;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if dans location` |
| **Apparue dans la version** | 1.13.12 |
| **Module** | [[11-modules/02-http/ngx_http_api_module\|ngx_http_api_module]] |

## Utilisation

Active la collecte des informations d'état des serveurs virtuels [[12-directives/server-http-core|http]] ou [[12-directives/server-stream-core|stream]] dans la *zone* indiquée. Plusieurs serveurs peuvent partager la même zone.

Depuis la version 1.17.0, les informations d'état peuvent être collectées par [[12-directives/location|location]]. La valeur spéciale `off` désactive la collecte dans les blocs location imbriqués. Notez que les statistiques sont collectées dans le contexte de la location où le traitement se termine, qui peut différer de la location d'origine en cas de [[12-directives/internal|redirection interne]] pendant le traitement.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

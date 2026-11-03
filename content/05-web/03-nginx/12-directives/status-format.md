---
title: "status_format"
description: "Directive nginx status_format (ngx_http_status_module) — Par défaut, les informations d'état sont renvoyées au format JSON. Les données peuvent aussi être renvoyées en JSONP. Le paramètre callback indique le nom de la fonction de rappel ; sa valeur peut…"
tags: [nginx, directive, ngx_http_status_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `status_format json;` ou `status_format jsonp [callback];` |
| **Valeur par défaut** | `status_format json;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_status_module\|ngx_http_status_module]] |

## Utilisation

Par défaut, les informations d'état sont renvoyées au format JSON.

Les données peuvent aussi être renvoyées en JSONP. Le paramètre *callback* indique le nom de la fonction de rappel ; sa valeur peut contenir des variables. Si le paramètre est omis ou que sa valeur calculée est vide, « `ngx_status_jsonp_callback` » est utilisé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

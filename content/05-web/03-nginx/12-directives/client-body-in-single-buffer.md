---
title: "client_body_in_single_buffer"
description: "Directive nginx client_body_in_single_buffer (ngx_http_core_module) — Indique si nginx doit conserver tout le corps de la requête du client dans un seul tampon. Recommandé avec la variable $request_body, pour réduire le nombre de copies."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_in_single_buffer on \| off;` |
| **Valeur par défaut** | `client_body_in_single_buffer off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Indique si nginx doit conserver tout le corps de la requête du client dans un seul tampon. Recommandé avec la variable `$request_body`, pour réduire le nombre de copies.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

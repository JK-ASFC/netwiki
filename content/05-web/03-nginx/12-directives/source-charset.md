---
title: "source_charset"
description: "Directive nginx source_charset (ngx_http_charset_module) — Définit le jeu de caractères source d'une réponse. S'il diffère de celui indiqué dans la directive charset, une conversion est effectuée."
tags: [nginx, directive, ngx_http_charset_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `source_charset charset;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_charset_module\|ngx_http_charset_module]] |

## Utilisation

Définit le jeu de caractères source d'une réponse. S'il diffère de celui indiqué dans la directive [[12-directives/charset|charset]], une conversion est effectuée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

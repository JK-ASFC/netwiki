---
title: "internal_redirect"
description: "Directive nginx internal_redirect (ngx_http_internal_redirect_module) — Définit l'URI de redirection interne de la requête. On peut aussi utiliser un bloc location nommé à la place de l'URI. La valeur uri peut contenir des variables. Si elle est vide, la redirection n'a…"
tags: [nginx, directive, ngx_http_internal_redirect_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `internal_redirect uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_internal_redirect_module\|ngx_http_internal_redirect_module]] |

## Utilisation

Définit l'URI de redirection interne de la requête. On peut aussi utiliser un [[11-modules/02-http/ngx_http_core_module|bloc location nommé]] à la place de l'URI. La valeur *uri* peut contenir des variables. Si elle est vide, la redirection n'a pas lieu.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "auth_request"
description: "Directive nginx auth_request (ngx_http_auth_request_module) — Active l'autorisation selon le résultat d'une sous-requête et définit l'URI auquel elle est envoyée."
tags: [nginx, directive, ngx_http_auth_request_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_request uri \| off;` |
| **Valeur par défaut** | `auth_request off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_auth_request_module\|ngx_http_auth_request_module]] |

## Utilisation

Active l'autorisation selon le résultat d'une sous-requête et définit l'URI auquel elle est envoyée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

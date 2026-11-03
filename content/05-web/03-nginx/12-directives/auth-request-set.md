---
title: "auth_request_set"
description: "Directive nginx auth_request_set (ngx_http_auth_request_module) — Affecte la valeur (value) donnée à la variable de requête (variable) une fois la requête d'autorisation terminée. La valeur peut contenir des variables de la requête d'autorisation, comme…"
tags: [nginx, directive, ngx_http_auth_request_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_request_set $variable value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_auth_request_module\|ngx_http_auth_request_module]] |

## Utilisation

Affecte la valeur (*value*) donnée à la variable de requête (*variable*) une fois la requête d'autorisation terminée. La valeur peut contenir des variables de la requête d'autorisation, comme `$upstream_http_*`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

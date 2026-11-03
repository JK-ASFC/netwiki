---
title: "scope"
description: "Directive nginx scope (ngx_http_oidc_module) — Définit les portées (scopes) demandées. La portée openid est toujours exigée par OIDC."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scope scope ...;` |
| **Valeur par défaut** | `scope openid;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit les portées (*scopes*) demandées. La portée `openid` est toujours exigée par OIDC.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

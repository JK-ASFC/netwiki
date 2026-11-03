---
title: "session_timeout"
description: "Directive nginx session_timeout (ngx_http_oidc_module) — Définit le délai au bout duquel la session est supprimée, sauf si elle a été rafraîchie."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_timeout time;` |
| **Valeur par défaut** | `session_timeout 8h;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit le délai au bout duquel la session est supprimée, sauf si elle a été [rafraîchie](https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokens).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

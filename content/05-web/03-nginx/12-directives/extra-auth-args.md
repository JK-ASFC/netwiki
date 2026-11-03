---
title: "extra_auth_args"
description: "Directive nginx extra_auth_args (ngx_http_oidc_module) — Définit des arguments de requête supplémentaires pour l'URL de la demande d'authentification. nginx extra_auth_args \"display=page&prompt=login\";"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `extra_auth_args string;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit des arguments de requête supplémentaires pour l'URL de la [demande d'authentification](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest).

```nginx
extra_auth_args "display=page&prompt=login";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
